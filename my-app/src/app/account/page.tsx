import { getServerSession } from "@/lib/get-session";
import { getTranslations, getLocale } from "next-intl/server";
import { User } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

function formatTestDate(d: Date, locale: string) {
  return d.toLocaleString(locale, {
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

  const t = await getTranslations("account");
  const locale = await getLocale();

  const tests = await prisma.test.findMany({
    where: { patientId: user.id },
    orderBy: { testedDay: "desc" },
  });

  const upcoming = tests.filter((t2) => t2.status === "UPCOMING");
  const current = tests.filter((t2) => t2.status === "CURRENT");
  const past = tests.filter((t2) => t2.status === "PAST");

  const ui = {
    title: t("title"),
    description: t("description"),
    upcoming: t("upcoming"),
    current: t("current"),
    past: t("past"),
    noUpcoming: t("noUpcoming"),
    noCurrent: t("noCurrent"),
    noPast: t("noPast"),
    reschedule: t("reschedule"),
    awaiting: t("awaiting"),
    viewResults: t("viewResults"),
    resultPending: t("resultPending"),
    newOrder: t("newOrder"),
    memberSince: t("memberSince"),
    verifyEmail: t("verifyEmail"),
    verifyBtn: t("verifyBtn"),
    badge_scheduled: t("badge_scheduled"),
    badge_inprogress: t("badge_inprogress"),
    badge_completed: t("badge_completed"),
  };

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>{ui.title}</h1>
        <p className={styles.bannerDesc}>{ui.description}</p>
      </div>

      {!user.emailVerified && <EmailVerificationAlert ui={ui} />}

      <div className={styles.main}>
        <ProfileInformation user={user} ui={ui} locale={locale} />

        <div className={styles.content}>
          {/* Upcoming */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{ui.upcoming}</h2>
            {upcoming.length === 0 ? (
              <p className={styles.empty}>{ui.noUpcoming}</p>
            ) : (
              upcoming.map((test) => (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{test.name}</span>
                    <span className={`${styles.badge} ${styles.badgeScheduled}`}>{ui.badge_scheduled}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDate}>{formatTestDate(test.testedDay, locale)}</p>
                    <p className={styles.cardLocation}>{test.location ?? "ImmunoLab"}</p>
                    <hr className={styles.divider} />
                    <div className={styles.cardFooter}>
                      <button className={styles.actionBtnGray}>{ui.reschedule}</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Current */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{ui.current}</h2>
            {current.length === 0 ? (
              <p className={styles.empty}>{ui.noCurrent}</p>
            ) : (
              current.map((test) => (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{test.name}</span>
                    <span className={`${styles.badge} ${styles.badgeInProgress}`}>{ui.badge_inprogress}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDate}>{formatTestDate(test.testedDay, locale)}</p>
                    <p className={styles.cardLocation}>{test.location ?? "ImmunoLab"}</p>
                    <hr className={styles.divider} />
                    <div className={styles.cardFooter}>
                      {test.resultUrl ? (
                        <ResultButton testId={test.id} label={ui.viewResults} />
                      ) : (
                        <button className={styles.actionBtnGreen} disabled>{ui.awaiting}</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Past */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{ui.past}</h2>
            {past.length === 0 ? (
              <p className={styles.empty}>{ui.noPast}</p>
            ) : (
              past.map((test) => (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{test.name}</span>
                    <span className={`${styles.badge} ${styles.badgeCompleted}`}>{ui.badge_completed}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDate}>{formatTestDate(test.testedDay, locale)}</p>
                    <p className={styles.cardLocation}>{test.location ?? "ImmunoLab"}</p>
                    <hr className={styles.divider} />
                    <div className={styles.cardFooter}>
                      {test.resultUrl ? (
                        <ResultButton testId={test.id} label={ui.viewResults} />
                      ) : (
                        <button className={styles.actionBtnGray} disabled>{ui.resultPending}</button>
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

function ResultButton({ testId, label }: { testId: string; label: string }) {
  return (
    <a href={`/api/results/${testId}`} target="_blank" rel="noopener noreferrer" className={styles.actionBtnPurple}>
      {label}
    </a>
  );
}

function ProfileInformation({ user, ui, locale }: { user: User; ui: Record<string, string>; locale: string }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar} />
      </div>
      <div className={styles.sidebarInfo}>
        <p className={styles.userName}>{user.name}</p>
        <p className={styles.userEmail}>{user.email}</p>
        <p className={styles.userCreatedAt}>
          {ui.memberSince}:{" "}
          {new Date(user.createdAt).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <button className={styles.newOrderBtn}>{ui.newOrder}</button>
    </aside>
  );
}

function EmailVerificationAlert({ ui }: { ui: Record<string, string> }) {
  return (
    <div className={styles.verificationAlert}>
      <p className={styles.verificationText}>✉️ {ui.verifyEmail}</p>
      <a href="/verify-email" className={styles.verificationBtn}>{ui.verifyBtn}</a>
    </div>
  );
}