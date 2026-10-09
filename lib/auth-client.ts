import { createAuthClient } from "better-auth/react"
import {
  emailOTPClient,
  usernameClient,
  organizationClient,
  adminClient,
  lastLoginMethodClient,
  multiSessionClient,
} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    emailOTPClient(),
    usernameClient(),
    organizationClient(),
    adminClient(),
    lastLoginMethodClient(),
    multiSessionClient(),
  ],
})

// Server-side auth (for use in Server Components, Server Actions, Route Handlers)
export const { signIn, signUp, signOut, useSession } = authClient
