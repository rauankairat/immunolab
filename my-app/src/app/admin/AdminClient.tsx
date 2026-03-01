"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const STATUS_LABELS = {
  upcoming: "Scheduled",
  current: "In Progress",
  past: "Completed",
};

type Test = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: "upcoming" | "current" | "past";
  hasResult?: boolean;
  resultUrl?: string | null;
  patient: {
    id: string;
    name: string;
    email: string;
  };
};

type Props = {
  upcoming: Test[];
  current: Test[];
  past: Test[];
};

export default function AdminClient({ upcoming, current, past }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  async function updateStatus(
    testId: string,
    status: "UPCOMING" | "CURRENT" | "PAST"
  ) {
    await fetch(`/api/tests/${testId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function uploadResult(testId: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`/api/tests/${testId}/result`, {
      method: "POST",
      body: fd,
    });
    router.refresh();
  }

  function viewResult(testId: string) {
    window.open(`/api/tests/${testId}/result/view`, "_blank");
  }

  const query = search.toLowerCase().trim();

  const filter = (tests: Test[]) =>
    query
      ? tests.filter(
          (t) =>
            t.patient.name.toLowerCase().includes(query) ||
            t.patient.email.toLowerCase().includes(query) ||
            t.name.toLowerCase().includes(query)
        )
      : tests;

  const filteredUpcoming = filter(upcoming);
  const filteredCurrent = filter(current);
  const filteredPast = filter(past);

  const totalResults =
    filteredUpcoming.length + filteredCurrent.length + filteredPast.length;
  const isSearching = query.length > 0;

  return (
    <>
      {/* Search Bar */}
      <div className={styles.searchWrap}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by patient name, email or test type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.searchClear}
              onClick={() => setSearch("")}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        {isSearching && (
          <p className={styles.searchMeta}>
            {totalResults === 0
              ? "No results found"
              : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${search}"`}
          </p>
        )}
      </div>

      <div className={styles.body}>
        {/* Upcoming */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionDot} data-status="upcoming" />
            <h2 className={styles.sectionTitle}>Upcoming Tests</h2>
            <span className={styles.sectionCount}>{filteredUpcoming.length}</span>
          </div>
          <div className={styles.list}>
            {filteredUpcoming.length === 0 && (
              <p className={styles.empty}>
                {isSearching ? "No matching upcoming tests." : "No upcoming tests."}
              </p>
            )}
            {filteredUpcoming.map((test) => (
              <TestCard key={test.id} test={test} updateStatus={updateStatus} uploadResult={uploadResult} viewResult={viewResult} />
            ))}
          </div>
        </section>

        {/* Current */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionDot} data-status="current" />
            <h2 className={styles.sectionTitle}>In Progress</h2>
            <span className={styles.sectionCount}>{filteredCurrent.length}</span>
          </div>
          <div className={styles.list}>
            {filteredCurrent.length === 0 && (
              <p className={styles.empty}>
                {isSearching ? "No matching tests in progress." : "No tests in progress."}
              </p>
            )}
            {filteredCurrent.map((test) => (
              <TestCard key={test.id} test={test} updateStatus={updateStatus} uploadResult={uploadResult} viewResult={viewResult} />
            ))}
          </div>
        </section>

        {/* Past */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionDot} data-status="past" />
            <h2 className={styles.sectionTitle}>Completed Tests</h2>
            <span className={styles.sectionCount}>{filteredPast.length}</span>
          </div>
          <div className={styles.list}>
            {filteredPast.length === 0 && (
              <p className={styles.empty}>
                {isSearching ? "No matching completed tests." : "No completed tests."}
              </p>
            )}
            {filteredPast.map((test) => (
              <TestCard key={test.id} test={test} updateStatus={updateStatus} uploadResult={uploadResult} viewResult={viewResult} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function TestCard({
  test,
  updateStatus,
  uploadResult,
  viewResult,
}: {
  test: Test;
  updateStatus: (testId: string, status: "UPCOMING" | "CURRENT" | "PAST") => Promise<void>;
  uploadResult: (testId: string, file: File) => Promise<void>;
  viewResult: (testId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    await uploadResult(test.id, file);
    setUploadedFileName(file.name);
    setUploading(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardLeft}>
          <span className={styles.testName}>{test.name}</span>
          <span
            className={`${styles.badge} ${
              test.status === "upcoming"
                ? styles.badgeUpcoming
                : test.status === "current"
                ? styles.badgeCurrent
                : styles.badgePast
            }`}
          >
            {STATUS_LABELS[test.status]}
          </span>
        </div>

        <div className={styles.cardActions}>
          {test.status === "upcoming" && (
            <button
              className={styles.btnOutline}
              onClick={() => updateStatus(test.id, "CURRENT")}
            >
              Mark as In Progress
            </button>
          )}

          {test.status === "current" && (
            <>
              {/* Success pill — appears after upload */}
              {uploadedFileName && (
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  color: "#16a34a",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  whiteSpace: "nowrap",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  ✅ {uploadedFileName}
                </span>
              )}

              {/* Upload / Replace button */}
              <label
                className={styles.uploadBtn}
                style={{
                  opacity: uploading ? 0.6 : 1,
                  pointerEvents: uploading ? "none" : "auto",
                }}
              >
                {uploading
                  ? "⏳ Uploading..."
                  : uploadedFileName
                  ? "🔄 Replace PDF"
                  : "📄 Upload PDF Result"}
                <input
                  type="file"
                  accept=".pdf"
                  className={styles.fileInput}
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                />
              </label>

              {/* Check Upload button — only visible after a successful upload */}
              {uploadedFileName && (
                <button
                  className={styles.btnOutline}
                  onClick={() => viewResult(test.id)}
                >
                  👁 Check Upload
                </button>
              )}

              <button
                className={styles.btnPrimary}
                onClick={() => updateStatus(test.id, "PAST")}
              >
                Mark as Completed
              </button>
            </>
          )}

          {test.status === "past" &&
            (test.hasResult ? (
              <>
                <button
                  className={styles.btnOutline}
                  onClick={() => viewResult(test.id)}
                >
                  👁 View PDF
                </button>
                <label className={styles.uploadBtn}>
                  🔄 Replace PDF
                  <input
                    type="file"
                    accept=".pdf"
                    className={styles.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadResult(test.id, file);
                    }}
                  />
                </label>
              </>
            ) : (
              <label className={styles.uploadBtnWarning}>
                ⚠️ Upload Missing Result
                <input
                  type="file"
                  accept=".pdf"
                  className={styles.fileInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadResult(test.id, file);
                  }}
                />
              </label>
            ))}
        </div>
      </div>

      <div className={styles.cardMeta}>
        <PatientChip name={test.patient.name} email={test.patient.email} />
        <span className={styles.metaDivider}>·</span>
        <span className={styles.metaText}>{test.date}</span>
        <span className={styles.metaDivider}>·</span>
        <span className={styles.metaText}>{test.location}</span>
      </div>
    </div>
  );
}

function PatientChip({ name, email }: { name: string; email: string }) {
  return (
    <span className={styles.patientChip}>
      <span className={styles.patientAvatar}>{name.charAt(0).toUpperCase()}</span>
      <span className={styles.patientName}>{name}</span>
      <span className={styles.patientEmail}>{email}</span>
    </span>
  );
}