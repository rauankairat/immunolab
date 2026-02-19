import { createAuthClient } from "better-auth/client"
import { nextCookies } from "better-auth/next-js"
export const { signIn, signUp, signOut, useSession } = createAuthClient();
export const authClient = createAuthClient({
    plugins: [nextCookies()]
})
