"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminTestClient.module.css";

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

type EditForm = {
  testName: string;
  patientName: string;
  location: string;
  status: string;
};

async function safeError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.error ?? data?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export default function AdminTestsClient({ tests: initialTests, ui }: { tests: Test[]; ui: Record<string, any> }) {
  const router = useRouter();
  const [tests, setTests] = useState(initialTests);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [editTest, setEditTest] = useState<Test | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ testName: "", patientName: "", location: "", status: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const query = search.toLowerCase().trim();
  const filtered = tests.filter(t => {
    const matchesSearch = !query ||
      t.testCode.toLowerCase().includes(query) ||
      t.testName.toLowerCase().includes(query) ||
      t.patientName.toLowerCase().includes(query) ||
      t.location.toLowerCase().includes(query);
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  function openEdit(t: Test) {
    setEditTest(t);
    setEditForm({
      testName: t.testName,
      patientName: t.patientName,
      location: t.location === "—" ? "" : t.location,
      status: t.status,
    });
    setEditError(null);
  }

  async function handleEdit() {
    if (!editTest) return;
    setEditLoading(true);
    setEditError(null);

    const res = await fetch(`/api/tests/${editTest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.testName,
        location: editForm.location,
        status: editForm.status,
      }),
    });

    if (!res.ok) {
      setEditError(await safeError(res));
      setEditLoading(false);
      return;
    }

    setTests(prev => prev.map(t => t.id === editTest.id ? {
      ...t,
      testName: editForm.testName,
      patientName: editForm.patientName,
      location: editForm.location || "—",
      status: editForm.status,
    } : t));

    setEditTest(null);
    setEditLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/tests/${deleteId}`, { method: "DELETE" });
    if (res.ok) setTests(prev => prev.filter(t => t.id !== deleteId));
    setDeleteId(null);
    setDeleteLoading(false);
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={ui.search_tests_placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className={styles.statusFilters}>
          {[
            { key: "ALL", label: ui.filter_all },
            { key: "UPCOMING", label: ui.filter_upcoming },
            { key: "CURRENT", label: ui.filter_current },
            { key: "PAST", label: ui.filter_past },
          ].map(s => (
            <button
              key={s.key}
              className={`${styles.filterBtn} ${filterStatus === s.key ? styles.filterBtnActive : ""}`}
              onClick={() => setFilterStatus(s.key)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.resultCount}>{filtered.length} {filtered.length !== 1 ? ui.filter_past : ui.filter_upcoming}</p>

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>{ui.col_code}</span>
          <span>{ui.col_patient}</span>
          <span>{ui.col_test}</span>
          <span>{ui.col_branch}</span>
          <span>{ui.col_date}</span>
          <span>{ui.col_result}</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>{ui.no_tests}</div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className={styles.tableRow}>
              <span className={styles.code}>{t.testCode}</span>
              <div className={styles.patientCell}>
                <span className={styles.patientName}>{t.patientName}</span>
                {t.patientEmail && <span className={styles.patientEmail}>{t.patientEmail}</span>}
              </div>
              <span className={styles.testName}>{t.testName}</span>
              <span className={styles.location}>{t.location}</span>
              <span className={styles.date}>{t.date}</span>
              <span>
                {t.hasResult ? (
                  <a href={`/api/tests/${t.id}/result/view`} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
                    {ui.view_pdf}
                  </a>
                ) : (
                  <span className={styles.noPdf}>{ui.no_pdf}</span>
                )}
              </span>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openEdit(t)} type="button">{ui.edit}</button>
                <button className={styles.deleteBtn} onClick={() => setDeleteId(t.id)} type="button">{ui.delete}</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editTest && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setEditTest(null)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{ui.edit_title}</h3>
              <button className={styles.closeBtn} onClick={() => setEditTest(null)} type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.modalDivider} />
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>{ui.field_test_name}</label>
                <input type="text" className={styles.input} value={editForm.testName}
                  onChange={e => setEditForm({ ...editForm, testName: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{ui.field_branch}</label>
                <input type="text" className={styles.input} value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{ui.field_status}</label>
                <select className={styles.input} value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="UPCOMING">{ui.status_upcoming}</option>
                  <option value="CURRENT">{ui.status_current}</option>
                  <option value="PAST">{ui.status_past}</option>
                </select>
              </div>
              {editError && <div className={styles.errorBox}><span>⚠</span><p>{editError}</p></div>}
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setEditTest(null)} type="button">{ui.cancel}</button>
                <button className={styles.submitBtn} onClick={handleEdit} disabled={editLoading} type="button">
                  {editLoading ? ui.saving : ui.save_changes}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{ui.delete_title}</h3>
            <div className={styles.modalDivider} />
            <p className={styles.deleteSub}>{ui.delete_sub}</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)} type="button">{ui.cancel}</button>
              <button className={styles.deleteBtnRed} onClick={handleDelete} disabled={deleteLoading} type="button">
                {deleteLoading ? ui.deleting : ui.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}