import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type Role = "USER" | "ADMIN" | "SUPERADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}