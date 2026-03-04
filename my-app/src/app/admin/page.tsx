import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import AdminUploadClient from "./AdminUploadClient";

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");
  if (user.role !== "ADMIN") redirect("/unauth");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Lab Dashboard</h1>
            <p className={styles.headerSub}>Upload patient test results</p>
          </div>
        </div>
      </div>
      <AdminUploadClient />
    </div>
  );
}