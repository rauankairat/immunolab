import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

export default async function OrderPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");

  return (
    <div className={styles.page}>
      {/* Page Header Banner */}
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>My Test Orders</h1>
        <p className={styles.bannerDesc}>
          Manage your test orders. Review upcoming, current and past test orders
          to stay informed about potential allergies and recommended medications.
        </p>
      </div>

      {/* Email verification alert */}
      {!user.emailVerified && <EmailVerificationAlert />}

      {/* Main Layout */}
      <div className={styles.main}>
        <ProfileInformation user={user} />

        <div className={styles.content}>
          {/* Upcoming */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upcoming Tests</h2>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Corona Virus Test</span>
                <span className={`${styles.badge} ${styles.badgeScheduled}`}>
                  Scheduled
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDate}>
                  15th April 2026, 10:00AM
                </p>
                <p className={styles.cardLocation}>
                  ImmunoLab - Almaty
                </p>

                <hr className={styles.divider} />

                <div className={styles.cardFooter}>
                  <button className={styles.actionBtnGray}>
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Current */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Current Test</h2>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Corona Virus Test</span>
                <span className={`${styles.badge} ${styles.badgeInProgress}`}>
                  In Progress
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDate}>
                  15th April 2026, 10:00AM
                </p>
                <p className={styles.cardLocation}>
                  ImmunoLab - Almaty
                </p>

                <hr className={styles.divider} />

                <div className={styles.cardFooter}>
                  <button className={styles.actionBtnGreen}>
                    Awaiting Lab Analysis...
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Past */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Past Tests</h2>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Corona Virus Test</span>
                <span className={`${styles.badge} ${styles.badgeCompleted}`}>
                  Completed
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.cardDate}>
                  10th April 2025, 10:00AM
                </p>
                <p className={styles.cardLocation}>
                  ImmunoLab - Almaty
                </p>

                <hr className={styles.divider} />

                <div className={styles.cardFooter}>
                  <button className={styles.actionBtnPurple}>
                    View Results
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

interface ProfileInformationProps {
  user: User;
}

function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar} />
      </div>

      <p className={styles.userName}>{user.name}</p>
      <p className={styles.userEmail}>{user.email}</p>
       <p className={styles.userCreatedAt}>
        Member since: <br />{new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className={styles.userPhone}>+777 7777 7777</p>

      <button className={styles.newOrderBtn}>
        + New Test Order
      </button>
    </aside>
  );
}

function EmailVerificationAlert() {
  return (
    <div className={styles.verificationAlert}>
      <p className={styles.verificationText}>
        ✉️ Please verify your email address to access all features.
      </p>

      <a href="/verify-email" className={styles.verificationBtn}>
        Verify Email
      </a>
    </div>
  );
}