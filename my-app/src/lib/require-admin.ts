import { getServerSession } from "@/lib/get-session";

export async function requireAdmin() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "ADMIN" && user.role !== "OWNER") {
    return { ok: false as const, user: null };
  }
  return { ok: true as const, user };
}