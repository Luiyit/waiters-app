import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosClient from "@/clients/axiosClient";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await axiosClient.post("/auth/login", {
            record: {
              email: credentials?.email,
              password: credentials?.password,
            },
          });

          if (response.data.success) {
            return {
              ...response.data.data.user,
              idToken: response.data.data.idToken,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.idToken = user.idToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken;
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 