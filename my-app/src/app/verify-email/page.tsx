import styles from "./page.module.css";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className={styles.page}>
      {/* ── Banner ── */}
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>Verify Email</h1>
        <p className={styles.bannerDesc}>
          Email verification is required to continue.
        </p>
      </div>

      {/* ── Main ── */}
      <div className={styles.main}>
        <div className={styles.card}>
          {/* Icon */}
          <div className={styles.iconWrap}>
            <div className={styles.lockIcon}>✉️</div>
          </div>

          <h2 className={styles.cardTitle}>Email Verification Required</h2>

          <p className={styles.cardDesc}>
            We have sent a verification link to your email address.
            Please open the email and click the link to confirm your account.
          </p>

          <p className={styles.cardDesc}>
            If you did not receive the email, you can request a new verification link.
          </p>

          <hr className={styles.divider} />

          <div className={styles.actions}>
            <button className={styles.resendBtn}>
              Resend Verification Email
            </button>
          </div>
          <Link href="/account" className={styles.homeLink}>
          ← Back to Account
          </Link>

         
        </div>
      </div>
    </div>
  );
}