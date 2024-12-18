import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";

// Define a custom interface for the token to provide type safety
interface CustomToken extends JWT {
  id: string;
  name?: string | null;
  email?: string | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    // Google OAuth Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // GitHub OAuth Login
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid email or password.");
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !(await compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password.");
        }
        return {
          id: user.id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    // Customize the JWT token
    async jwt({ token, user }) {
      if (user) {
        (token as CustomToken).id = user.id;
        (token as CustomToken).name = user.name;
        (token as CustomToken).email = user.email;
      }
      return token;
    },
    // Customize the session object
    async session({ session, token }) {
      session.user = token as CustomToken;
      return session;
    },
  },
};
