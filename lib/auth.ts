import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import * as schema from "./schema"
import {
  emailOTP,
  username,
  organization,
  admin,
  lastLoginMethod,
  multiSession
} from "better-auth/plugins"
import { sendOtpEmail } from "./email"

console.log("[AUTH] Initializing Better Auth...")
console.log("[AUTH] Database URL exists:", !!process.env.DATABASE_URL)
console.log("[AUTH] Better Auth URL:", process.env.BETTER_AUTH_URL)
console.log("[AUTH] Google Client ID exists:", !!process.env.GOOGLE_CLIENT_ID)
console.log("[AUTH] Resend API Key exists:", !!process.env.RESEND_API_KEY)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  plugins: [
    username(),
    organization({
      creatorRole: "owner",
      allowUserToCreateOrganization: true,
      // Allow up to 3 orgs per user - prevents accidental "hit limit" errors
      // while still encouraging single-org usage for TMS
      organizationLimit: 3,
      teams: { enabled: false },
    }),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      contextPath: "admin",
    }),
    lastLoginMethod(),
    multiSession(),
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      disableSignUp: false,
      async sendVerificationOTP({ email, otp, type }) {
        console.log("[AUTH] === emailOTP.sendVerificationOTP called ===")
        console.log("[AUTH] emailOTP type:", type)
        try {
          await sendOtpEmail({ email, otp, type })
          console.log("[AUTH] ✅ emailOTP email sent successfully")
        } catch (err) {
          console.error("[AUTH] ❌ emailOTP email send failed:", err)
          throw err
        }
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
})

console.log("[AUTH] ✅ Better Auth initialized")
