import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import prismadb from "./prismadb";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "crendentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Checking if empty
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Credentials");
        }

        // Getting User in DB
        const user = await prismadb.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        // If no User, User ID and User Password
        if (!user || !user.id || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // const currentHashedPassword = await bcrypt.hash(
        //   credentials.password,
        //   12
        // );
        // if (currentHashedPassword !== user.hashedPassword) {
        //   throw new Error("Invalid credentials");
        // }

        // Checking Password
        const correctPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // If Not CorrectPAss
        if (!correctPassword) {
          throw new Error("Invalid credentials");
        }

        // Must Return The User
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
};
