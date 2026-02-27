"use client";

import { useState } from "react";
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
  const [search, setSearch] = useState("");

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
              <TestCard key={test.id} test={test} />
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
              <TestCard key={test.id} test={test} />
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
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function TestCard({ test }: { test: Test }) {
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
            <button className={styles.btnOutline}>Mark as In Progress</button>
          )}
          {test.status === "current" && (
            <>
              <label className={styles.uploadBtn}>
                📄 Upload PDF Result
                <input type="file" accept=".pdf" className={styles.fileInput} />
              </label>
              <button className={styles.btnPrimary}>Mark as Completed</button>
            </>
          )}
          {test.status === "past" && (
            test.hasResult ? (
              <>
                <button className={styles.btnOutline}>👁 View PDF</button>
                <label className={styles.uploadBtn}>
                  🔄 Replace PDF
                  <input type="file" accept=".pdf" className={styles.fileInput} />
                </label>
              </>
            ) : (
              <label className={styles.uploadBtnWarning}>
                ⚠️ Upload Missing Result
                <input type="file" accept=".pdf" className={styles.fileInput} />
              </label>
            )
          )}
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