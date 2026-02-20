import Link from "next/link";
import styles from "./page.module.css";

export default function UnauthorizedPage() {
  return (
    <div className={styles.page}>

      {/* ── Banner ── */}
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>Access Restricted</h1>
        <p className={styles.bannerDesc}>
          You need to be signed in to view this page.
        </p>
      </div>

      {/* ── Main ── */}
      <div className={styles.main}>
        <div className={styles.card}>

          {/* Icon */}
          <div className={styles.iconWrap}>
            <div className={styles.lockIcon}>🔒</div>
          </div>

          <h2 className={styles.cardTitle}>Unauthorised Access</h2>
          <p className={styles.cardDesc}>
            This page is only available to signed-in users. Please sign in to
            your ImmunoLab account to manage your test orders, view results, and
            access your profile.
          </p>

          <hr className={styles.divider} />

          <div className={styles.actions}>
            <Link href="/login" className={styles.signInBtn}>
              Sign In
            </Link>
            <Link href="/register" className={styles.registerBtn}>
              Create an Account
            </Link>
          </div>

          <p className={styles.homeLink}>
            <Link href="/">← Back to Home</Link>
          </p>

        </div>
      </div>

    </div>
  );
}