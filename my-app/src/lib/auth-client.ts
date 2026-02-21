import { createAuthClient } from "better-auth/client"
import { nextCookies } from "better-auth/next-js"
import {inferAdditionalFields} from "better-auth/client/plugins"
import { auth } from "./auth";
export const { signIn, signUp, signOut, useSession } = createAuthClient();
export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        nextCookies()]
})
