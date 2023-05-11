import type { NextAuthOptions, RequestInternal, User } from "next-auth";
import type { User as UserModel } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

export const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined,
        _req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<User | null> {
        if (!credentials) return null;

        const user: UserModel | null = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (user) {
          if (user.password !== credentials.password) return null;
          // Any object returned will be saved in `user` property of the JWT
          return {
            id: user.id,
            name: user.name,
            email: user.username,
            image: user.image,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
};
