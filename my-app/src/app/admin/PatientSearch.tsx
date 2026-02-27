"use client";

import { useState } from "react";
import styles from "./PatientSearch.module.css";

// ── Mock patients (replace with DB fetch later) ───────────────────────────────
const MOCK_ALL_PATIENTS = [
  { id: "p1", name: "Aisha Bekova", email: "aisha.bekova@email.com", createdAt: "February 10, 2026", testCount: 1 },
  { id: "p2", name: "Daniyar Seitkali", email: "daniyar@email.com", createdAt: "January 5, 2026", testCount: 1 },
  { id: "p3", name: "Madina Nurova", email: "madina.n@email.com", createdAt: "December 20, 2025", testCount: 2 },
  { id: "p4", name: "Ruslan Akhmetov", email: "ruslan.a@email.com", createdAt: "March 1, 2026", testCount: 1 },
  { id: "p5", name: "Zarina Ospanova", email: "zarina.o@email.com", createdAt: "February 28, 2026", testCount: 0 },
  { id: "p6", name: "Bekzat Nurlanov", email: "bekzat.n@email.com", createdAt: "February 15, 2026", testCount: 0 },
];

type Patient = (typeof MOCK_ALL_PATIENTS)[number];
type UploadForm = { testName: string; testDate: string; file: File | null };

export default function PatientSearch() {
  const [query, setQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<UploadForm>({ testName: "", testDate: "", file: null });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const results = query.trim().length > 0
    ? MOCK_ALL_PATIENTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function openModal(patient: Patient) {
    setSelectedPatient(patient);
    setForm({ testName: "", testDate: "", file: null });
    setSubmitted(false);
  }

  function closeModal() {
    setSelectedPatient(null);
    setSubmitted(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.testName || !form.testDate || !form.file) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // TODO: replace with real API call
    setLoading(false);
    setSubmitted(true);
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
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <button className={styles.clearBtn} onClick={() => setQuery("")} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {query.trim().length > 0 && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <p>No patients found for <strong>"{query}"</strong></p>
              <span className={styles.noResultsSub}>Check the spelling or try searching by email</span>
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
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.patientInfo}>
                        <span className={styles.patientName}>{patient.name}</span>
                        <span className={styles.patientEmail}>{patient.email}</span>
                        <span className={styles.patientMeta}>
                          Member since {patient.createdAt} ·{" "}
                          {patient.testCount === 0 ? "No tests yet" : `${patient.testCount} test${patient.testCount !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                    <button className={styles.uploadTrigger} onClick={() => openModal(patient)} type="button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
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
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            {!submitted ? (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalPatient}>
                    <div className={styles.modalAvatar}>
                      {selectedPatient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.modalPatientName}>{selectedPatient.name}</p>
                      <p className={styles.modalPatientEmail}>{selectedPatient.email}</p>
                    </div>
                  </div>
                  <button className={styles.closeBtn} onClick={closeModal} type="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className={styles.modalDivider} />

                <h3 className={styles.modalTitle}>Upload Test Result</h3>
                <p className={styles.modalSub}>Fill in the test details and attach the PDF result.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.label}>Test Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Corona Virus Test"
                      value={form.testName}
                      onChange={(e) => setForm({ ...form, testName: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Test Date</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={form.testDate}
                      onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>PDF Result</label>
                    <label className={styles.fileZone}>
                      {form.file ? (
                        <div className={styles.fileSelected}>
                          <span className={styles.fileIcon}>📄</span>
                          <span className={styles.fileName}>{form.file.name}</span>
                          <button
                            type="button"
                            className={styles.fileRemove}
                            onClick={(e) => { e.preventDefault(); setForm({ ...form, file: null }); }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className={styles.filePrompt}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" className={styles.fileUploadIcon}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span className={styles.filePromptText}>Click to upload PDF</span>
                          <span className={styles.filePromptSub}>PDF files only</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".pdf"
                        className={styles.hiddenInput}
                        onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                        required
                      />
                    </label>
                  </div>

                  <div className={styles.modalActions}>
                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={loading || !form.testName || !form.testDate || !form.file}
                    >
                      {loading ? <span className={styles.spinner} /> : "Upload Result"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className={styles.success}>
                <div className={styles.successIcon}>✅</div>
                <h3 className={styles.successTitle}>Result Uploaded</h3>
                <p className={styles.successSub}>
                  <strong>{form.testName}</strong> result has been successfully uploaded for{" "}
                  <strong>{selectedPatient.name}</strong>.
                </p>
                <button className={styles.submitBtn} onClick={closeModal} type="button">
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