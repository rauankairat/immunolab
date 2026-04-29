"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";

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

type Props = {
  ui: Record<string, string>;
  locale: string;
};

export default function SearchClient({ ui, locale }: Props) {
  const [code, setCode] = useState("");
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiresDob, setRequiresDob] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const incoming = searchParams.get("code");

    if (incoming && incoming.length === 8) {
      setCode(incoming);

      fetch(`/api/search?code=${incoming}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.requiresDob) {
            setRequiresDob(true);
          } else if (data.test) {
            setResult(data.test);
          } else {
            setError(ui.autoNotFound);
          }
        })
        .catch(() => {
          setError(ui.errorNotFound);
        });
    }
  }, [searchParams, ui.autoNotFound, ui.errorNotFound]);

  async function handleSearch() {
    if (code.length !== 8) {
      setError(ui.errorInvalid);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRequiresDob(false);
    setDob("");

    try {
      const res = await fetch(`/api/search?code=${code}`);
      const data = await res.json();

      if (data.requiresDob) {
        setRequiresDob(true);
      } else if (!res.ok || !data.test) {
        setError(ui.errorNotFound);
      } else {
        setResult(data.test);
      }
    } catch {
      setError(ui.errorNotFound);
    } finally {
      setLoading(false);
    }
  }

  async function handleDobSubmit() {
    if (!dob) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?code=${code}&dob=${dob}`);
      const data = await res.json();

      if (res.status === 403) {
        setError(ui.errorDob ?? "Incorrect date of birth. Please try again.");
      } else if (!res.ok || !data.test) {
        setError(ui.errorNotFound);
      } else {
        setRequiresDob(false);
        setResult(data.test);
      }
    } catch {
      setError(ui.errorNotFound);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>{ui.eyebrow}</p>
          <h1 className={styles.heroTitle}>{ui.title}</h1>
          <p className={styles.heroSub}>{ui.sub}</p>
        </div>
      </div>

      {/* Search */}
      <div className={styles.body}>
        <div className={styles.searchSection}>
          <p className={styles.sectionLabel}>{ui.codeLabel}</p>

          <div className={styles.searchRow}>
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder={ui.placeholder}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={handleKeyDown}
            />

            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={loading || code.length !== 8}
            >
              {loading ? ui.searching : ui.search}
            </button>
          </div>

          <p className={styles.hint}>{ui.hint}</p>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <span className={styles.errorIcon}>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {/* DOB verification step */}
        {requiresDob && !result && (
          <div className={styles.searchSection}>
            <p className={styles.sectionLabel}>
              {ui.dobLabel ?? "DATE OF BIRTH"}
            </p>

            <p className={styles.hint}>
              {ui.dobHint ??
                "Please enter your date of birth to verify your identity."}
            </p>

            <div className={styles.searchRow}>
              <input
                className={styles.input}
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />

              <button
                className={styles.searchBtn}
                onClick={handleDobSubmit}
                disabled={loading || !dob}
              >
                {loading ? ui.searching : ui.search}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={styles.resultSection}>
            <p className={styles.sectionLabel}>{ui.resultLabel}</p>

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
                  <span className={styles.metaLabel}>{ui.metaDate}</span>
                  <span className={styles.metaValue}>
                    {new Date(result.testDate).toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{ui.metaName}</span>
                  <span className={styles.metaValue}>{result.name}</span>
                </div>

                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{ui.metaBranch}</span>
                  <span className={styles.metaValue}>
                    {result.location ?? "-"}
                  </span>
                </div>
              </div>

              {result.resultUrl ? (
                <a
                  href={`/api/search/result?code=${result.testCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  {ui.viewPdf}
                </a>
              ) : (
                <div className={styles.pendingBox}>
                  <p>{ui.pending}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}