import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import AdminTabs from "./AdminTabs";
import { prisma } from "@/lib/prisma";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");
  if (user.role !== "ADMIN") redirect("/unauth");

  const tests = await prisma.test.findMany({
    orderBy: { testedDay: "desc" },
    select: {
      id: true,
      testCode: true,
      name: true,
      testedDay: true,
      status: true,
      location: true,
      resultUrl: true,
      resultName: true,
      walkinName: true,
      patient: {
        select: { name: true, email: true },
      },
    },
  });

  const shaped = tests.map(t => ({
    id: t.id,
    testCode: t.testCode ?? "—",
    testName: t.name,
    patientName: t.patient?.name ?? t.walkinName ?? "Unknown",
    patientEmail: t.patient?.email ?? null,
    location: t.location ?? "—",
    date: formatDate(t.testedDay),
    status: t.status as string,
    hasResult: Boolean(t.resultUrl),
    resultUrl: t.resultUrl ?? null,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Lab Dashboard</h1>
            <p className={styles.headerSub}>Upload results and manage all tests</p>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{shaped.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{shaped.filter(t => t.hasResult).length}</span>
              <span className={styles.statLabel}>With Results</span>
            </div>
          </div>
        </div>
      </div>
      <AdminTabs tests={shaped} />
    </div>
  );
}