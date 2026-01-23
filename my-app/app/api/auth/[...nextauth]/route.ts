import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Replace this with your actual database check
        // For now, this is a dummy example:
        
        if (credentials?.email === "test@test.com" && credentials?.password === "password") {
          // Return user object on success
          return {
            id: "1",
            name: "Test User",
            email: "test@test.com"
          }
        }
        
        // Return null if login fails
        return null
      }
    }),
    GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET,
        }),
  ],
  pages: {
    signIn: '/login', // Use your custom login page
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }