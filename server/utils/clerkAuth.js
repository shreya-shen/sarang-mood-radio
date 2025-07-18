const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { getOrCreateUserUUID } = require('./userMapping');
const { clerkClient } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Clerk auth error:', error);
    return { error: 'Authentication failed' };
  }
});

// Enhanced middleware that also ensures user profile exists
const requireAuthWithProfile = async (req, res, next) => {
  // First apply Clerk auth
  requireAuth(req, res, async (error) => {
    if (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    try {
      const { userId } = req.auth;
      
      // Get Clerk user data to create a proper profile
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        await getOrCreateUserUUID(userId, clerkUser);
      } catch (clerkError) {
        console.error('Error fetching Clerk user data:', clerkError);
        // Fallback to creating profile without Clerk data
        await getOrCreateUserUUID(userId);
      }
      
      next();
    } catch (profileError) {
      console.error('Error in profile middleware:', profileError);
      // Continue with request even if profile operations fail
      // The individual controllers will handle profile creation if needed
      next();
    }
  });
};

module.exports = requireAuthWithProfile;