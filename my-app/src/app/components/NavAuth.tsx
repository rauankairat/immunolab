import { getServerSession } from "@/lib/get-session";
import NavAuthClient from "./NavAuthClient";

export default async function NavAuth() {
  const session = await getServerSession();
  const user = session?.user

  return <NavAuthClient user={user ?? null} />;
}