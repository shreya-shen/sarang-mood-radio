const supabase = require('./supabase');
const crypto = require('crypto');

// Generate a consistent UUID from Clerk user ID
const generateUUIDFromClerkId = (clerkUserId) => {
  // Create a consistent UUID by hashing the Clerk ID
  // This ensures the same Clerk ID always generates the same UUID
  const hash = crypto.createHash('sha256').update(clerkUserId).digest('hex');
  
  // Format as UUID (version 4 format)
  const uuid = [
    hash.substr(0, 8),
    hash.substr(8, 4),
    '4' + hash.substr(13, 3), // Version 4
    ((parseInt(hash.substr(16, 1), 16) & 3) | 8).toString(16) + hash.substr(17, 3), // Variant bits
    hash.substr(20, 12)
  ].join('-');
  
  return uuid;
};

// Create or get UUID for a Clerk user ID
const getOrCreateUserUUID = async (clerkUserId, clerkUserData = null) => {
  try {
    const userUUID = generateUUIDFromClerkId(clerkUserId);
    
    // Check if user profile exists
    const { data: existingUser, error: findError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('id', userUUID)
      .single();

    if (existingUser) {
      return userUUID;
    }

    // If user doesn't exist, create profile with generated UUID
    if (findError && findError.code === 'PGRST116') {
      // Prepare profile data from Clerk user data if available
      let username = '';
      let email = '';
      
      if (clerkUserData) {
        username = clerkUserData.username || 
                  clerkUserData.firstName || 
                  clerkUserData.fullName || 
                  '';
                  
        // Try multiple ways to get email
        email = clerkUserData.primaryEmailAddress?.emailAddress || 
                clerkUserData.emailAddress || 
                (clerkUserData.emailAddresses && clerkUserData.emailAddresses[0]?.emailAddress) ||
                '';
      }

      const profileData = {
        id: userUUID,
        name: username,
        email: email,
        created_at: new Date().toISOString()
      };

      const { error: createError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (createError) {
        console.error('Error creating user profile:', createError);
        // Don't throw error, just return the UUID
      }

      return userUUID;
    }

    // If there's another error, still return the generated UUID
    console.error('Error finding user profile:', findError);
    return userUUID;
  } catch (error) {
    console.error('Error in getOrCreateUserUUID:', error);
    // Fallback to just generating the UUID
    return generateUUIDFromClerkId(clerkUserId);
  }
};

module.exports = { getOrCreateUserUUID, generateUUIDFromClerkId };
