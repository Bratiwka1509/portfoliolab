import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

export const authOptions = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            bannedAt: true,
          },
        });
        if (!user) return null;
        if (user.bannedAt) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        const authUser = {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        } satisfies { id: string; email: string; name?: string; role: Role };

        return authUser as unknown as { id: string; email: string; name?: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = (user as unknown as { role?: Role }).role;
        if (role) (token as unknown as { role?: Role }).role = role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role?: Role }).role = (token as unknown as { role?: Role }).role;
      }
      return session;
    },
  },
};

