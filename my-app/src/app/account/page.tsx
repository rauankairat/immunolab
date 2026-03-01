import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

function formatTestDate(d: Date) {
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function OrderPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");

  // Fetch real tests for this patient
  const tests = await prisma.test.findMany({
    where: { patientId: user.id },
    orderBy: { testedDay: "desc" },
  });

  const upcoming = tests.filter((t) => t.status === "UPCOMING");
  const current = tests.filter((t) => t.status === "CURRENT");
  const past = tests.filter((t) => t.status === "PAST");

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
            {upcoming.length === 0 ? (
              <p className={styles.empty}>No upcoming tests.</p>
            ) : (
              upcoming.map((test) => (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{test.name}</span>
                    <span className={`${styles.badge} ${styles.badgeScheduled}`}>
                      Scheduled
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDate}>{formatTestDate(test.testedDay)}</p>
                    <p className={styles.cardLocation}>{test.location ?? "ImmunoLab"}</p>
                    <hr className={styles.divider} />
                    <div className={styles.cardFooter}>
                      <button className={styles.actionBtnGray}>Reschedule</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Current */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Current Test</h2>
            {current.length === 0 ? (
              <p className={styles.empty}>No tests currently in progress.</p>
            ) : (
              current.map((test) => (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{test.name}</span>
                    <span className={`${styles.badge} ${styles.badgeInProgress}`}>
                      In Progress
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDate}>{formatTestDate(test.testedDay)}</p>
                    <p className={styles.cardLocation}>{test.location ?? "ImmunoLab"}</p>
                    <hr className={styles.divider} />
                    <div className={styles.cardFooter}>
                      {test.resultUrl ? (
                        <ResultButton testId={test.id} />
                      ) : (
                        <button className={styles.actionBtnGreen} disabled>
                          Awaiting Lab Analysis...
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Past */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Past Tests</h2>
            {past.length === 0 ? (
              <p className={styles.empty}>No past tests.</p>
            ) : (
              past.map((test) => (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{test.name}</span>
                    <span className={`${styles.badge} ${styles.badgeCompleted}`}>
                      Completed
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDate}>{formatTestDate(test.testedDay)}</p>
                    <p className={styles.cardLocation}>{test.location ?? "ImmunoLab"}</p>
                    <hr className={styles.divider} />
                    <div className={styles.cardFooter}>
                      {test.resultUrl ? (
                        <ResultButton testId={test.id} />
                      ) : (
                        <button className={styles.actionBtnGray} disabled>
                          Result Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function ResultButton({ testId }: { testId: string }) {
  return (
    <a
      href={`/api/results/${testId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.actionBtnPurple}
    >
      View Results
    </a>
  );
}

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
        Member since: <br />
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className={styles.userPhone}>+777 7777 7777</p>

      <button className={styles.newOrderBtn}>+ New Test Order</button>
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