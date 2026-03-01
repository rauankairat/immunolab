"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientSearch.module.css";

type Patient = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  age?: number | null;
};

type UploadForm = { testName: string; testDate: string; file: File | null };

async function safeError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.error ?? data?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export default function PatientSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<UploadForm>({
    testName: "",
    testDate: "",
    file: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldSearch = query.trim().length > 0;

  const results = useMemo(() => patients, [patients]);

  useEffect(() => {
    if (!shouldSearch) {
      setPatients([]);
      return;
    }

    const controller = new AbortController();
    const q = query.trim();

    async function run() {
      try {
        setLoadingResults(true);
        setError(null);

        const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          const msg = await safeError(res);
          throw new Error(msg || "Failed to search patients");
        }

        const data = (await res.json()) as Patient[];
        setPatients(data);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Something went wrong");
        setPatients([]);
      } finally {
        setLoadingResults(false);
      }
    }

    const t = setTimeout(run, 250);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, shouldSearch]);

  function openModal(patient: Patient) {
    setSelectedPatient(patient);
    setForm({ testName: "", testDate: "", file: null });
    setSubmitted(false);
    setError(null);
  }

  function closeModal() {
    setSelectedPatient(null);
    setSubmitted(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPatient) return;
    if (!form.testName || !form.testDate || !form.file) return;

    try {
      setLoadingSubmit(true);
      setError(null);

      // 1) create test row
      const createRes = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          name: form.testName,
          testedDay: form.testDate,
          location: "ImmunoLab",
        }),
      });

      if (!createRes.ok) {
        const msg = await safeError(createRes);
        throw new Error(msg || "Failed to create test");
      }

      const created = (await createRes.json()) as { id: string };
      const testId = created.id;

      // 2) upload PDF
      const fd = new FormData();
      fd.append("file", form.file);

      const uploadRes = await fetch(`/api/tests/${testId}/result`, {
        method: "POST",
        body: fd,
      });

      if (!uploadRes.ok) {
        const msg = await safeError(uploadRes);
        throw new Error(msg || "Failed to upload PDF");
      }

      // 3) mark as PAST
      await fetch(`/api/tests/${testId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAST" }),
      });

      setSubmitted(true);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Patient Directory</h2>
          <p className={styles.sub}>
            Search any registered patient and upload test results directly.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className={styles.searchBox}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by patient name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => setQuery("")}
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="16"
              height="16"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {shouldSearch && (
        <div className={styles.results}>
          {loadingResults ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>⏳</span>
              <p>Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <p>
                No patients found for <strong>"{query}"</strong>
              </p>
              <span className={styles.noResultsSub}>
                Check the spelling or try searching by email
              </span>
            </div>
          ) : (
            <>
              <p className={styles.resultsMeta}>
                {results.length} patient{results.length !== 1 ? "s" : ""} found
              </p>

              <div className={styles.patientList}>
                {results.map((patient) => (
                  <div key={patient.id} className={styles.patientCard}>
                    <div className={styles.patientLeft}>
                      <div className={styles.avatar}>
                        {(patient.name?.[0] ?? patient.email[0]).toUpperCase()}
                      </div>
                      <div className={styles.patientInfo}>
                        <span className={styles.patientName}>
                          {patient.name ?? "Unnamed Patient"}
                        </span>
                        <span className={styles.patientEmail}>{patient.email}</span>
                        <span className={styles.patientMeta}>
                          Member since{" "}
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      className={styles.uploadTrigger}
                      onClick={() => openModal(patient)}
                      type="button"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="15"
                        height="15"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Upload Result
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedPatient && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className={styles.modal}>
            {!submitted ? (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalPatient}>
                    <div className={styles.modalAvatar}>
                      {(
                        selectedPatient.name?.[0] ?? selectedPatient.email[0]
                      ).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.modalPatientName}>
                        {selectedPatient.name ?? "Unnamed Patient"}
                      </p>
                      <p className={styles.modalPatientEmail}>
                        {selectedPatient.email}
                      </p>
                    </div>
                  </div>

                  <button
                    className={styles.closeBtn}
                    onClick={closeModal}
                    type="button"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="18"
                      height="18"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className={styles.modalDivider} />

                <h3 className={styles.modalTitle}>Upload Test Result</h3>
                <p className={styles.modalSub}>
                  Fill in the test details and attach the PDF result.
                </p>

                {error && (
                  <p style={{ marginTop: 8, color: "var(--danger, #b00020)" }}>
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Test Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Corona Virus Test"
                      value={form.testName}
                      onChange={(e) =>
                        setForm({ ...form, testName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Test Date</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={form.testDate}
                      onChange={(e) =>
                        setForm({ ...form, testDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>PDF Result</label>
                    <label className={styles.fileZone}>
                      {form.file ? (
                        <div className={styles.fileSelected}>
                          <span className={styles.fileIcon}>📄</span>
                          <span className={styles.fileName}>
                            {form.file.name}
                          </span>
                          <button
                            type="button"
                            className={styles.fileRemove}
                            onClick={(e) => {
                              e.preventDefault();
                              setForm({ ...form, file: null });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className={styles.filePrompt}>
                          <span className={styles.filePromptText}>
                            Click to upload PDF
                          </span>
                          <span className={styles.filePromptSub}>
                            PDF files only
                          </span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept=".pdf"
                        className={styles.hiddenInput}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            file: e.target.files?.[0] ?? null,
                          })
                        }
                        required
                      />
                    </label>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={
                        loadingSubmit ||
                        !form.testName ||
                        !form.testDate ||
                        !form.file
                      }
                    >
                      {loadingSubmit ? "Uploading..." : "Upload Result"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className={styles.success}>
                <div className={styles.successIcon}>✅</div>
                <h3 className={styles.successTitle}>Result Uploaded</h3>
                <p className={styles.successSub}>
                  <strong>{form.testName}</strong> result has been successfully
                  uploaded for{" "}
                  <strong>
                    {selectedPatient.name ?? selectedPatient.email}
                  </strong>
                  .
                </p>
                <button
                  className={styles.submitBtn}
                  onClick={closeModal}
                  type="button"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}