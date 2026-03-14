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

export default function AdminUploadClient({ ui }: { ui: Record<string, any> }) {
  const [tab, setTab] = useState<Tab>("registered");
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [walkinName, setWalkinName] = useState("");
  const [form, setForm] = useState<UploadForm>(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);

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
    if (!/^\d{8}$/.test(form.testCode)) {
      setSubmitError(ui.err_code);
      return;
    }
    if (!form.testName || !form.testDate || !form.branch || !form.file) {
      setSubmitError(ui.err_fields);
      return;
    }
    if (tab === "registered" && !selectedPatient) {
      setSubmitError(ui.err_patient);
      return;
    }
    if (tab === "walkin" && !walkinName.trim()) {
      setSubmitError(ui.err_walkin);
      return;
    }

    setSubmitLoading(true);

    try {
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

      if (!createRes.ok) throw new Error(await safeError(createRes));
      const created = await createRes.json() as { id: string; testCode: string };

      const fd = new FormData();
      fd.append("file", form.file!);
      const uploadRes = await fetch(`/api/tests/${created.id}/result`, {
        method: "POST",
        body: fd,
      });
      if (!uploadRes.ok) throw new Error(await safeError(uploadRes));

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

  if (submitted && resultCode) {
    const patientLabel = tab === "registered"
      ? (selectedPatient?.name ?? selectedPatient?.email)
      : walkinName;

    return (
      <div className={styles.wrap}>
        <div className={styles.stepCard}>
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>{ui.success_title}</h3>
            <p className={styles.successSub}>
              {ui.success_sub} <strong>{patientLabel}</strong>.
            </p>
            <div className={styles.codeDisplay}>
              <p className={styles.codeDisplayLabel}>{ui.code_label}</p>
              <p className={styles.codeDisplayValue}>{resultCode}</p>
              <p className={styles.codeDisplayHint}>{ui.code_hint}</p>
            </div>
            <button className={styles.submitBtn} onClick={handleReset} type="button">
              {ui.upload_another}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const showForm = (tab === "registered" && selectedPatient) || (tab === "walkin");

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "registered" ? styles.tabActive : ""}`}
          onClick={() => switchTab("registered")}
          type="button"
        >
          {ui.tab_registered}
        </button>
        <button
          className={`${styles.tab} ${tab === "walkin" ? styles.tabActive : ""}`}
          onClick={() => switchTab("walkin")}
          type="button"
        >
          {ui.tab_walkin}
        </button>
      </div>

      <div className={styles.stepCard}>
        <p className={styles.stepLabel}>{ui.step1_label}</p>

        {tab === "registered" ? (
          <>
            <h2 className={styles.stepTitle}>{ui.step1_registered_title}</h2>
            <p className={styles.stepSub}>{ui.step1_registered_sub}</p>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={ui.search_placeholder}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedPatient(null); }}
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

            {patients.length > 0 && !selectedPatient && (
              <div className={styles.dropdown}>
                {patients.map(p => (
                  <div key={p.id} className={styles.dropdownItem} onClick={() => handleSelectPatient(p)}>
                    <div className={styles.dropdownAvatar}>
                      {(p.name?.[0] ?? p.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className={styles.dropdownName}>{p.name ?? ui.unknown}</p>
                      <p className={styles.dropdownEmail}>{p.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchLoading && <p className={styles.searchHint}>{ui.searching}</p>}

            {selectedPatient && (
              <div className={styles.selectedChip}>
                <div className={styles.chipAvatar}>
                  {(selectedPatient.name?.[0] ?? selectedPatient.email[0]).toUpperCase()}
                </div>
                <div>
                  <p className={styles.chipName}>{selectedPatient.name ?? ui.unknown}</p>
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
            <h2 className={styles.stepTitle}>{ui.step1_walkin_title}</h2>
            <p className={styles.stepSub}>{ui.step1_walkin_sub}</p>
            <input
              type="text"
              className={styles.input}
              placeholder={ui.walkin_placeholder}
              value={walkinName}
              onChange={e => setWalkinName(e.target.value)}
              style={{ maxWidth: 400 }}
            />
          </>
        )}
      </div>

      {showForm && (
        <div className={styles.stepCard}>
          <p className={styles.stepLabel}>{ui.step2_label}</p>
          <h2 className={styles.stepTitle}>{ui.step2_title}</h2>
          <p className={styles.stepSub}>{ui.step2_sub}</p>

          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                {ui.test_code_label} <span className={styles.labelHint}>({ui.test_code_hint})</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={8}
                className={`${styles.input} ${styles.codeInput}`}
                placeholder="00000000"
                value={form.testCode}
                onChange={e => setForm({ ...form, testCode: e.target.value.replace(/\D/g, "") })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>{ui.test_name_label}</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={ui.test_name_placeholder}
                  value={form.testName}
                  onChange={e => setForm({ ...form, testName: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{ui.test_date_label}</label>
                <input
                  type="date"
                  className={styles.input}
                  value={form.testDate}
                  onChange={e => setForm({ ...form, testDate: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.field}>
  <label className={styles.label}>{ui.branch_label}</label>
  <select
    className={styles.input}
    value={form.branch}
    onChange={e => setForm({ ...form, branch: e.target.value })}
  >
    
    <option value="AllergoExpress Immunolab — ул. Шагабутдинова, 132">AllergoExpress Immunolab — ул. Шагабутдинова, 132</option>
    <option value="МЦ Tau Sunkar — ул. Розыбакиева, 33 А">МЦ Tau Sunkar — ул. Розыбакиева, 33 А</option>
    <option value="МЦ New Med — мкр. 10 А, 22 А">МЦ New Med — мкр. 10 А, 22 А</option>
    <option value="Comfort Clinic — пр. Серкебаева, 146/12">Comfort Clinic — пр. Серкебаева, 146/12</option>
    <option value="МЦ Доктор Калимолдаева — ул. Кенесары Хана, 54/11">МЦ Доктор Калимолдаева — ул. Кенесары Хана, 54/11</option>
    <option value="LB Clinic — пр. Райымбека, 540/7">LB Clinic — пр. Райымбека, 540/7</option>
    <option value="МЦ АдкМед — ул. Туркебаева, 257 Е">МЦ АдкМед — ул. Туркебаева, 257 Е</option>
    <option value="Interteach Clinic — пр-т Назарбаева, 257 Е">Interteach Clinic — пр-т Назарбаева, 257 Е</option>
    <option value="Interteach Clinic — пр-т Назарбаева, 111">Interteach Clinic — пр-т Назарбаева, 111</option>
    <option value="Interteach Clinic — мкр. 6, д. 16">Interteach Clinic — мкр. 6, д. 16</option>
    <option value="Interteach (Педиатрия) — мкр. Самал-2, ул. Мендикулова, 49">Interteach (Педиатрия) — мкр. Самал-2, ул. Мендикулова, 49</option>
    <option value="Interteach (Педиатрия) — ул. Кабанбай батыра, 122 А">Interteach (Педиатрия) — ул. Кабанбай батыра, 122 А</option>
    <option value="МЦ Жасмин — пер. Абая, 14">МЦ Жасмин — пер. Абая, 14</option>
  </select>
</div>

            <div className={styles.field}>
              <label className={styles.label}>{ui.pdf_label}</label>
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
                      {ui.pdf_remove}
                    </button>
                  </div>
                ) : (
                  <div className={styles.filePrompt}>
                    <span className={styles.filePromptText}>{ui.pdf_prompt}</span>
                    <span className={styles.filePromptSub}>{ui.pdf_sub}</span>
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
              {submitLoading ? ui.uploading : ui.upload_result}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}