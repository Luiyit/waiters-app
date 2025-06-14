import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firebaseId: string;
      email: string;
      name: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
    idToken: string;
  }

  interface User {
    id: string;
    firebaseId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    idToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken: string;
    user: {
      id: string;
      firebaseId: string;
      email: string;
      name: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
  }
} 