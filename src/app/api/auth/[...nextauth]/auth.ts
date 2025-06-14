import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosClient from "@/clients/axiosClient";

export const authOptions: NextAuthOptions = {
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
        const { idToken, ...userData } = user;
        token.idToken = idToken;
        token.user = userData;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.idToken = token.idToken;
      }
      return session;
    },
  },
}; 