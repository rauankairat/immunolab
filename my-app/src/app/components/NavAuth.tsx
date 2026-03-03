import { getServerSession } from "@/lib/get-session";
import { cookies } from "next/headers";
import NavAuthClient from "./NavAuthClient";

import LanguageSelector from "@/app/components/LanguageSelector";

export default async function NavAuth() {
  const session = await getServerSession();
  const user = session?.user;

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "en";

  return (
    <>
      <LanguageSelector current={locale} />
      <NavAuthClient
        user={user ? { name: user.name ?? "", email: user.email, role: user.role ?? "BASIC" } : null}
      />
    </>
  );
}