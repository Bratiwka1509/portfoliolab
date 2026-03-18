import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UsersClient from "./usersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as unknown as { role?: string } | undefined)?.role;

  if (!session?.user?.email) redirect("/auth/login?callbackUrl=/admin/users");
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect("/");

  return <UsersClient />;
}

