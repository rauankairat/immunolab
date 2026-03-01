import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import AdminClient from "./AdminClient";
import PatientSearch from "./PatientSearch";
import { prisma } from "@/lib/prisma";

function mapStatus(status: "UPCOMING" | "CURRENT" | "PAST") {
  if (status === "UPCOMING") return "upcoming" as const;
  if (status === "CURRENT") return "current" as const;
  return "past" as const;
}

function formatTestDate(d: Date) {
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");
  if (user.role !== "ADMIN") redirect("/unauth");

  const tests = await prisma.test.findMany({
    orderBy: { testedDay: "desc" },
    include: {
      patient: { select: { id: true, name: true, email: true } },
    },
  });

  const shaped = tests.map((t) => ({
    id: t.id,
    name: t.name,
    date: formatTestDate(t.testedDay),
    location: t.location ?? "ImmunoLab",
    status: mapStatus(t.status),
    hasResult: Boolean(t.resultUrl),
    resultUrl: t.resultUrl ?? null,
    patient: {
      id: t.patient.id,
      name: t.patient.name ?? "Unnamed Patient",
      email: t.patient.email,
    },
  }));

  const upcoming = shaped.filter((t) => t.status === "upcoming");
  const current = shaped.filter((t) => t.status === "current");
  const past = shaped.filter((t) => t.status === "past");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Lab Dashboard</h1>
            <p className={styles.headerSub}>Manage patient tests and upload results</p>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{upcoming.length}</span>
              <span className={styles.statLabel}>Upcoming</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{current.length}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{past.length}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>
        </div>
      </div>

      <AdminClient upcoming={upcoming} current={current} past={past} />
      <PatientSearch />
    </div>
  );
}