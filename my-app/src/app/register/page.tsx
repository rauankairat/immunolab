import { getServerSession } from '@/lib/get-session';
import RegisterClient from './registerClient';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';

const page = async () => {
  const session = await getServerSession();
  if (session?.user) redirect("/account");

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = await getTranslations({ locale, namespace: "register" });

  return (
    <RegisterClient
      sideTitle={t("sideTitle")}
      sideText={t("sideText")}
      title={t("title")}
      nameLabel={t("nameLabel")}
      emailLabel={t("emailLabel")}
      passwordLabel={t("passwordLabel")}
      showPasswordLabel={t("showPassword")}
      hidePasswordLabel={t("hidePassword")}
      confirmLabel={t("confirmLabel")}
      registeringLabel={t("registering")}
      registerLabel={t("register")}
      hasAccount={t("hasAccount")}
      signInLabel={t("signIn")}
      successToast={t("successToast")}
    />
  )
}

export default page;