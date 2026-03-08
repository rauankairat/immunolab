"use client";

import { useState } from "react";
import styles from "./OrderModal.module.css";

type Product = {
  id: number;
  name: string;
  description: string;
};

type UI = Record<string, any>;

type Props = {
  selectedProducts: Product[];
  listType: string;
  express: boolean;
  total: number;
  pricePerItem: number;
  ui: UI;
  onClose: () => void;
};

export default function OrderModal({
  selectedProducts,
  listType,
  express,
  total,
  pricePerItem,
  ui,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const branches: string[] = ui.branches ?? [];

  async function handleSubmit() {
    if (!name.trim() || !phone.trim() || !branch) {
      setError(ui.fill_fields);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          branch,
          listType,
          express,
          total,
          pricePerItem,
          products: selectedProducts.map(p => ({
            name: p.name,
            description: p.description,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to submit order");
      }

      const data = await res.json();
      setPdfUrl(data.pdfUrl);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const count = selectedProducts.length;

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {!success ? (
          <>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>{ui.complete_order}</h3>
                <p className={styles.modalSub}>
                  {count} · {total.toLocaleString()} ₸ {ui.total.toLowerCase()}
                </p>
              </div>
              <button className={styles.closeBtn} onClick={onClose} type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.testsList}>
              <p className={styles.testsLabel}>{ui.selected_tests}</p>
              <div className={styles.testsScroll}>
                {selectedProducts.map((p, i) => (
                  <div key={p.id} className={styles.testItem}>
                    <span className={styles.testNum}>{i + 1}</span>
                    <span className={styles.testName}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>{ui.full_name}</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={ui.full_name_placeholder}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{ui.phone}</label>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder={ui.phone_placeholder}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{ui.branch}</label>
                <select
                  className={styles.input}
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                >
                  <option value="">{ui.branch_placeholder}</option>
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {express && (
                <div className={styles.expressTag}>
                  {ui.express_tag}
                </div>
              )}

              {error && (
                <div className={styles.errorBox}>
                  <span>⚠</span>
                  <p>{error}</p>
                </div>
              )}

              <div className={styles.totalRow}>
                <span>{ui.total}</span>
                <strong>{total.toLocaleString()} ₸</strong>
              </div>

              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading}
                type="button"
              >
                {loading ? ui.submitting : ui.confirm_order}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>{ui.order_submitted}</h3>
            <p className={styles.successSub}>{ui.order_success_sub}</p>
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.pdfBtn}>
                {ui.download_pdf}
              </a>
            )}
            <button className={styles.submitBtn} onClick={onClose} type="button">
              {ui.done}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}