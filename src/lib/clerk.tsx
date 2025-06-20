
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key')
}

export { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser }
export { CLERK_PUBLISHABLE_KEY }
