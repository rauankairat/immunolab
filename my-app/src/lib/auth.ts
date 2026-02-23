import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({user, url}){
      await sendEmail({
        to: user.email,
        subject: "Verify your email / Подтвердить почту",
text: `Click the link to verify your email: / Нажмите на ссылку чтоб подтвердить почту: ${url}`,
      })

    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "BASIC"
      }
    }
  },
  trustedOrigins: ["http://localhost:3001"],
});

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user;