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

export default function AdminTabs({ tests, ui }: { tests: Test[]; ui: Record<string, any> }) {
  const [tab, setTab] = useState<"upload" | "tests">("upload");

  return (
    <div>
      <div className={styles.pageTabs}>
        <button
          className={`${styles.pageTab} ${tab === "upload" ? styles.pageTabActive : ""}`}
          onClick={() => setTab("upload")}
          type="button"
        >
          {ui.tab_upload}
        </button>
        <button
          className={`${styles.pageTab} ${tab === "tests" ? styles.pageTabActive : ""}`}
          onClick={() => setTab("tests")}
          type="button"
        >
          {ui.tab_tests}
          <span className={styles.pageTabCount}>{tests.length}</span>
        </button>
      </div>
      {tab === "upload" && <AdminUploadClient ui={ui} />}
      {tab === "tests" && <AdminTestsClient tests={tests} ui={ui} />}
    </div>
  );
}