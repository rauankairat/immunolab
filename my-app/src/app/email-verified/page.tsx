import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default async function EmailVerifiedPage() {
  const session = await getServerSession();
  const user = session?.user;


  if (!user) {
    redirect("/login");
  }


  if (user.emailVerified) {
    redirect("/account");
  }

  

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>Email Verified</h1>
        <p className={styles.bannerDesc}>
          Your account is now confirmed and ready to use.
        </p>
      </div>

      <div className={styles.main}>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Verification Status</h2>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Email confirmation</span>
                <span className={`${styles.badge} ${styles.badgeCompleted}`}>
                  Completed
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDate}>
                  Your email has been successfully verified.
                </p>
                <p className={styles.cardLocation}>
                  Теперь вы можете пользоваться всеми функциями аккаунта.
                </p>

                <hr className={styles.divider} />

                <div className={styles.cardFooter}>
                  <Link
                    href="/account"
                    className={styles.actionBtnGreen}
                  >
                    Go to Account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}