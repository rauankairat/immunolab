"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Result = {
  name: string;
  patientName: string;
  testDate: string;
  testCode: string;
  status: string;
  resultUrl: string | null;
  resultName: string | null;
  location: string | null;  
};

export default function SearchPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (code.length !== 10) {
      setError("Please enter a valid 10-digit test code.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await fetch(`/api/search?code=${code}`);
    const data = await res.json();

    if (!res.ok || !data.test) {
      setError("No test found with that code. Please check and try again.");
    } else {
      setResult(data.test);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Allergo Express Med</p>
          <h1 className={styles.heroTitle}>Find Your Test Results</h1>
          <p className={styles.heroSub}>Enter your 10-digit test code to retrieve your results.</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.body}>
        <div className={styles.searchSection}>
          <p className={styles.sectionLabel}>TEST CODE</p>
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="0000000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={handleKeyDown}
            />
            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={loading || code.length !== 10}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className={styles.hint}>Your test code is printed on your receipt and confirmation email.</p>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <span className={styles.errorIcon}>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={styles.resultSection}>
            <p className={styles.sectionLabel}>TEST RESULT</p>

            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.resultHeaderLeft}>
                  <p className={styles.resultCode}>{result.testCode}</p>
                  <p className={styles.resultName}>{result.patientName}</p>
                </div>
                <div className={styles.statusBadge} data-status={result.status}>
                  {result.status}
                </div>
              </div>

              <div className={styles.resultMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Test Date</span>
                  <span className={styles.metaValue}>
                    {new Date(result.testDate).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Test Name</span>
                  <span className={styles.metaValue}>{result.name}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>branch</span>
                  <span className={styles.metaValue}>{result.location}</span>
                </div>
              </div>

              {result.resultUrl ? (
                <a
                  href={`/api/search/result?code=${result.testCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  View Result PDF →
                </a>
              ) : (
                <div className={styles.pendingBox}>
                  <p>Your result is not yet available. Please check back later.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}