"use client";

import { useState } from "react";
import AdminUploadClient from "./AdminUploadClient";
import AdminTestsClient from "./AdminTestClient";
import styles from "./AdminUpload.module.css";

type Test = {
  id: string;
  testCode: string;
  testName: string;
  patientName: string;
  patientEmail: string | null;
  location: string;
  date: string;
  status: string;
  hasResult: boolean;
  resultUrl: string | null;
};

export default function AdminTabs({ tests }: { tests: Test[] }) {
  const [tab, setTab] = useState<"upload" | "tests">("upload");

  return (
    <div>
      <div className={styles.pageTabs}>
        <button
          className={`${styles.pageTab} ${tab === "upload" ? styles.pageTabActive : ""}`}
          onClick={() => setTab("upload")}
          type="button"
        >
          Upload Result
        </button>
        <button
          className={`${styles.pageTab} ${tab === "tests" ? styles.pageTabActive : ""}`}
          onClick={() => setTab("tests")}
          type="button"
        >
          All Tests
          <span className={styles.pageTabCount}>{tests.length}</span>
        </button>
      </div>

      {tab === "upload" && <AdminUploadClient />}
      {tab === "tests" && <AdminTestsClient tests={tests} />}
    </div>
  );
}