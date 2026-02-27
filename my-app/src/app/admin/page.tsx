import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import AdminClient from "./AdminClient";
import PatientSearch from "./PatientSearch";


// ── Mock data (replace with DB calls later) ──────────────────────────────────
const MOCK_PATIENTS = [
  {
    id: "p1",
    name: "Aisha Bekova",
    email: "aisha.bekova@email.com",
    tests: [
      {
        id: "t1",
        name: "Corona Virus Test",
        date: "15th April 2026, 10:00AM",
        location: "ImmunoLab - Almaty",
        status: "upcoming" as const,
      },
    ],
  },
  {
    id: "p2",
    name: "Daniyar Seitkali",
    email: "daniyar@email.com",
    tests: [
      {
        id: "t2",
        name: "Allergy Panel Test",
        date: "15th April 2026, 10:00AM",
        location: "ImmunoLab - Almaty",
        status: "current" as const,
      },
    ],
  },
  {
    id: "p3",
    name: "Madina Nurova",
    email: "madina.n@email.com",
    tests: [
      {
        id: "t3",
        name: "Blood Count Test",
        date: "10th April 2025, 10:00AM",
        location: "ImmunoLab - Almaty",
        status: "past" as const,
        hasResult: true,
      },
      {
        id: "t4",
        name: "Corona Virus Test",
        date: "20th March 2025, 09:00AM",
        location: "ImmunoLab - Almaty",
        status: "past" as const,
        hasResult: false,
      },
    ],
  },
  {
    id: "p4",
    name: "Ruslan Akhmetov",
    email: "ruslan.a@email.com",
    tests: [
      {
        id: "t5",
        name: "Hepatitis B Test",
        date: "20th April 2026, 11:00AM",
        location: "ImmunoLab - Astana",
        status: "upcoming" as const,
      },
    ],
  },
];

const STATUS_LABELS = {
  upcoming: "Scheduled",
  current: "In Progress",
  past: "Completed",
};

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");
  if (user.role !== "ADMIN") redirect("/unauth");

  const upcoming = MOCK_PATIENTS.flatMap((p) =>
    p.tests
      .filter((t) => t.status === "upcoming")
      .map((t) => ({ ...t, patient: p }))
  );

  const current = MOCK_PATIENTS.flatMap((p) =>
    p.tests
      .filter((t) => t.status === "current")
      .map((t) => ({ ...t, patient: p }))
  );

  const past = MOCK_PATIENTS.flatMap((p) =>
    p.tests
      .filter((t) => t.status === "past")
      .map((t) => ({ ...t, patient: p }))
  );

  const allPatients = MOCK_PATIENTS.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
  }));

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Lab Dashboard</h1>
            <p className={styles.headerSub}>
              Manage patient tests and upload results
            </p>
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