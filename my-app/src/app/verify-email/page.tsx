import { getServerSession } from "@/lib/get-session";
import styles from "./page.module.css";
import { redirect, unauthorized } from "next/navigation";
import { ResendVerificationButton } from "../components/ResendVerification";

export default async function VerifyEmailPage() {
    const session = await getServerSession()
    const user = session?.user;

    if(!user) unauthorized() ;

    if(user.emailVerified) redirect("/account")
  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>Verify Email</h1>
        <p className={styles.bannerDesc}>
          Email verification is required to continue.
        </p>
      </div>

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <div className={styles.iconRing}>
              <div className={styles.icon}>✉️</div>
            </div>
          </div>

          <h2 className={styles.cardTitle}>Check your inbox</h2>

          <p className={styles.cardDesc}>
            We sent a verification link to your email address. Open the email and click the link to confirm your account.
          </p>

          <div className={styles.tipBox}>
            <p className={styles.tipTitle}>Didn’t get the email?</p>
            <ul className={styles.tipList}>
              <li>Check Spam or Promotions</li>
              <li>Wait 1 to 2 minutes and refresh your inbox</li>
              <li>Make sure your email address is correct</li>
            </ul>
          </div>

          <hr className={styles.divider} />

          <div className={styles.actions}>
            <ResendVerificationButton email={user.email} />
          </div>

          <p className={styles.footerNote}>
            You can close this page after you verify.
          </p>
        </div>
      </div>
    </div>
  );
}