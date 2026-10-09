import { createAuthClient } from "better-auth/react"
import { emailOTPClient, usernameClient, organizationClient, adminClient, lastLoginMethodClient,multiSessionClient} from "better-auth/client/plugins"
export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(),
        usernameClient(),
        organizationClient(),
        adminClient(),
        lastLoginMethodClient(),
        multiSessionClient(),
    ]
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
})