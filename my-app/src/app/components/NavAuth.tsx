import { getServerSession } from "@/lib/get-session";
import { getTranslations } from "next-intl/server";
import NavAuthClient from "./NavAuthClient";

export const dynamic = "force-dynamic";

export default async function NavAuth() {
  const session = await getServerSession();
  const user = session?.user;
  const t = await getTranslations("nav");

  const labels = {
    account: t("account"),
    myAccount: t("myAccount"),
    adminDashboard: t("adminDashboard"),
    ownerDashboard: t("ownerDashboard"),
    signOut: t("signOut"),
    signIn: t("signIn"),
    register: t("register"),
    signOutSuccess: t("signOutSuccess"),
    signOutError: t("signOutError"),
  };

  return (
    <NavAuthClient
      user={user ? { name: user.name ?? "", email: user.email, role: user.role ?? "BASIC" } : null}
      labels={labels}
    />
  );
}