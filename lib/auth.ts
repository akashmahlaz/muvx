import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; //  drizzle instance
import * as schema from "@/schema"
import { emailOTP , username, organization, admin, lastLoginMethod, multiSession} from "better-auth/plugins"



export const auth = betterAuth({
   plugins: [
    username(),
    organization(),
    admin(),
    lastLoginMethod(),
    multiSession(),
        emailOTP({ 
            async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                    // Send the OTP for sign in
                } else if (type === "email-verification") { 
                    // Send the OTP for email verification
                } else { 
                    // Send the OTP for password reset
                } 
            }, 
        }) 
    ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    linkedin: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
});