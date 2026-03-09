import { getServerSession } from '@/lib/get-session';
import LoginPage from './loginClient';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';

const page = async () => {
  const session = await getServerSession();
  if (session?.user) redirect("/account");

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const t = await getTranslations({ locale, namespace: "login" });

  return (
    <LoginPage
      welcome={t("welcome")}
      welcomeLine2={t("welcomeLine2")}
      sub={t("sub")}
      title={t("title")}
      emailLabel={t("emailLabel")}
      passwordLabel={t("passwordLabel")}
      forgotPassword={t("forgotPassword")}
      signingIn={t("signingIn")}
      signInLabel={t("signIn")}
      noAccount={t("noAccount")}
      registerLabel={t("register")}
      successToast={t("successToast")}
    />
  )
}

export default page;