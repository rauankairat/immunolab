"use client";

import { useEffect, useState } from "react";
import styles from "./AdminUpload.module.css";

type Tab = "registered" | "walkin";

type Patient = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

type UploadForm = {
  testCode: string;
  testName: string;
  testDate: string;
  branch: string;
  file: File | null;
};

async function safeError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.error ?? data?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

const EMPTY_FORM: UploadForm = {
  testCode: "",
  testName: "",
  testDate: "",
  branch: "",
  file: null,
};

export default function AdminUploadClient() {
  const [tab, setTab] = useState<Tab>("registered");

  // Registered tab state
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Walk-in tab state
  const [walkinName, setWalkinName] = useState("");

  // Shared form state
  const [form, setForm] = useState<UploadForm>(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);

  // Patient search with debounce
  useEffect(() => {
    if (tab !== "registered" || query.trim().length === 0) {
      setPatients([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(`/api/patients?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
      } catch {
        // aborted or failed
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, tab]);

  function switchTab(t: Tab) {
    setTab(t);
    setQuery("");
    setPatients([]);
    setSelectedPatient(null);
    setWalkinName("");
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setSubmitted(false);
    setResultCode(null);
  }

  function handleSelectPatient(p: Patient) {
    setSelectedPatient(p);
    setQuery(p.name ?? p.email);
    setPatients([]);
  }

  function handleReset() {
    setQuery("");
    setPatients([]);
    setSelectedPatient(null);
    setWalkinName("");
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setSubmitted(false);
    setResultCode(null);
  }

  async function handleSubmit() {
    setSubmitError(null);

    // Validate testCode
    if (!/^\d{10}$/.test(form.testCode)) {
      setSubmitError("Test code must be exactly 10 digits.");
      return;
    }
    if (!form.testName || !form.testDate || !form.branch || !form.file) {
      setSubmitError("Please fill in all fields and attach a PDF.");
      return;
    }
    if (tab === "registered" && !selectedPatient) {
      setSubmitError("Please select a patient.");
      return;
    }
    if (tab === "walkin" && !walkinName.trim()) {
      setSubmitError("Please enter the patient name.");
      return;
    }

    setSubmitLoading(true);

    try {
      // 1. Create test row
      const createRes = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(tab === "registered"
            ? { patientId: selectedPatient!.id }
            : { walkinName: walkinName.trim() }),
          name: form.testName,
          testedDay: form.testDate,
          location: form.branch,
          testCode: form.testCode,
        }),
      });

      if (!createRes.ok) {
        throw new Error(await safeError(createRes));
      }

      const created = await createRes.json() as { id: string; testCode: string };

      // 2. Upload PDF
      const fd = new FormData();
      fd.append("file", form.file!);
      const uploadRes = await fetch(`/api/tests/${created.id}/result`, {
        method: "POST",
        body: fd,
      });

      if (!uploadRes.ok) {
        throw new Error(await safeError(uploadRes));
      }

      // 3. Mark as PAST
      await fetch(`/api/tests/${created.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAST" }),
      });

      setResultCode(created.testCode);
      setSubmitted(true);
    } catch (e: any) {
      setSubmitError(e?.message || "Upload failed");
    } finally {
      setSubmitLoading(false);
    }
  }

  // ── Success screen ──
  if (submitted && resultCode) {
    const patientLabel = tab === "registered"
      ? (selectedPatient?.name ?? selectedPatient?.email)
      : walkinName;

    return (
      <div className={styles.wrap}>
        <div className={styles.stepCard}>
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>Result Uploaded</h3>
            <p className={styles.successSub}>
              Result for <strong>{patientLabel}</strong> has been uploaded successfully.
            </p>
            <div className={styles.codeDisplay}>
              <p className={styles.codeDisplayLabel}>Patient's Test Code</p>
              <p className={styles.codeDisplayValue}>{resultCode}</p>
              <p className={styles.codeDisplayHint}>Give this code to the patient — they can use it on the search page to retrieve their result.</p>
            </div>
            <button className={styles.submitBtn} onClick={handleReset} type="button">
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ──
  const showForm = (tab === "registered" && selectedPatient) || (tab === "walkin");

  return (
    <div className={styles.wrap}>

      {/* Tab switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "registered" ? styles.tabActive : ""}`}
          onClick={() => switchTab("registered")}
          type="button"
        >
          Registered Patient
        </button>
        <button
          className={`${styles.tab} ${tab === "walkin" ? styles.tabActive : ""}`}
          onClick={() => switchTab("walkin")}
          type="button"
        >
          Walk-in / No Account
        </button>
      </div>

      {/* Step 1 */}
      <div className={styles.stepCard}>
        <p className={styles.stepLabel}>STEP 1 — IDENTIFY PATIENT</p>

        {tab === "registered" ? (
          <>
            <h2 className={styles.stepTitle}>Search Registered Patient</h2>
            <p className={styles.stepSub}>Search by name or email to find the patient's account.</p>

            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search by name or email..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedPatient(null);
                }}
                autoComplete="off"
              />
              {query && (
                <button className={styles.clearBtn} onClick={() => { setQuery(""); setSelectedPatient(null); setPatients([]); }} type="button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {patients.length > 0 && !selectedPatient && (
              <div className={styles.dropdown}>
                {patients.map(p => (
                  <div key={p.id} className={styles.dropdownItem} onClick={() => handleSelectPatient(p)}>
                    <div className={styles.dropdownAvatar}>
                      {(p.name?.[0] ?? p.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.dropdownName}>{p.name ?? "Unnamed"}</p>
                      <p className={styles.dropdownEmail}>{p.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchLoading && <p className={styles.searchHint}>Searching...</p>}

            {/* Selected patient chip */}
            {selectedPatient && (
              <div className={styles.selectedChip}>
                <div className={styles.chipAvatar}>
                  {(selectedPatient.name?.[0] ?? selectedPatient.email[0]).toUpperCase()}
                </div>
                <div>
                  <p className={styles.chipName}>{selectedPatient.name ?? "Unnamed"}</p>
                  <p className={styles.chipEmail}>{selectedPatient.email}</p>
                </div>
                <button className={styles.chipRemove} onClick={() => { setSelectedPatient(null); setQuery(""); }} type="button">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className={styles.stepTitle}>Walk-in Patient</h2>
            <p className={styles.stepSub}>Enter the patient's full name. No account required.</p>
            <input
              type="text"
              className={styles.input}
              placeholder="Patient full name"
              value={walkinName}
              onChange={e => setWalkinName(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </>
        )}
      </div>

      {/* Step 2 — Upload form */}
      {showForm && (
        <div className={styles.stepCard}>
          <p className={styles.stepLabel}>STEP 2 — TEST DETAILS & UPLOAD</p>
          <h2 className={styles.stepTitle}>Fill in Details & Upload PDF</h2>
          <p className={styles.stepSub}>Enter the test information and attach the result PDF.</p>

          <div className={styles.form}>
            {/* Test code */}
            <div className={styles.field}>
              <label className={styles.label}>Test Code <span className={styles.labelHint}>(10 digits — written on patient's receipt)</span></label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                className={`${styles.input} ${styles.codeInput}`}
                placeholder="0000000000"
                value={form.testCode}
                onChange={e => setForm({ ...form, testCode: e.target.value.replace(/\D/g, "") })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>Test Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. IgE Allergy Panel"
                  value={form.testName}
                  onChange={e => setForm({ ...form, testName: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Test Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={form.testDate}
                  onChange={e => setForm({ ...form, testDate: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Branch</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. AllergoExpress Immunolab, Shagabutdinova 132"
                value={form.branch}
                onChange={e => setForm({ ...form, branch: e.target.value })}
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
                      onClick={e => { e.preventDefault(); setForm({ ...form, file: null }); }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className={styles.filePrompt}>
                    <span className={styles.filePromptText}>Click to upload PDF</span>
                    <span className={styles.filePromptSub}>PDF files only · max 10MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className={styles.hiddenInput}
                  onChange={e => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                />
              </label>
            </div>

            {submitError && (
              <div className={styles.errorBox}>
                <span>⚠</span>
                <p>{submitError}</p>
              </div>
            )}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitLoading}
              type="button"
            >
              {submitLoading ? "Uploading..." : "Upload Result"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}