import { getServerSession } from "@/lib/get-session";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { ResendVerificationButton } from "../components/ResendVerification";
import VerifyPoller from "./VerifyPoller";

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const session = await getServerSession();
  const user = session?.user;
  const { email: emailParam } = await searchParams;

  if (user?.emailVerified) redirect("/account");

  const email = user?.email ?? emailParam ?? "";
  const t = await getTranslations("verifyEmail");

  const labels = {
    sending: t("sending"),
    resend: t("resend"),
    success: t("success"),
    error: t("error"),
  };

  return (
    <div className={styles.page}>
      <VerifyPoller email={email} />
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>{t("title")}</h1>
        <p className={styles.bannerDesc}>{t("desc")}</p>
      </div>
      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <div className={styles.iconRing}>
              <div className={styles.icon}>✉️</div>
            </div>
          </div>
          <h2 className={styles.cardTitle}>{t("cardTitle")}</h2>
          <p className={styles.cardDesc}>{t("cardDesc")}</p>
          <div className={styles.tipBox}>
            <p className={styles.tipTitle}>{t("tipTitle")}</p>
            <ul className={styles.tipList}>
              <li>{t("tip1")}</li>
              <li>{t("tip2")}</li>
              <li>{t("tip3")}</li>
            </ul>
          </div>
          <hr className={styles.divider} />
          <div className={styles.actions}>
            <ResendVerificationButton email={email} labels={labels} />
          </div>
          <p className={styles.footerNote}>{t("footerNote")}</p>
        </div>
      </div>
    </div>
  );
}