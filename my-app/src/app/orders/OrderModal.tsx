"use client";

import { useState } from "react";
import styles from "./OrderModal.module.css";

type Product = {
  id: number;
  name: string;
  description: string;
};

type Props = {
  selectedProducts: Product[];
  listType: string;
  express: boolean;
  total: number;
  pricePerItem: number;
  onClose: () => void;
};

const BRANCHES = [
  "Shagabutdinova 132",
  "Dostyk 117",
  "Alatau district",
  "Medeu district",
  "Bostandyk district",
];

export default function OrderModal({
  selectedProducts,
  listType,
  express,
  total,
  pricePerItem,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  async function handleSubmit() {
    if (!name.trim() || !phone.trim() || !branch) {
      setError("Please fill in all fields.");
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

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {!success ? (
          <>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Complete Your Order</h3>
                <p className={styles.modalSub}>{selectedProducts.length} test{selectedProducts.length !== 1 ? "s" : ""} · {total.toLocaleString()} ₸ total</p>
              </div>
              <button className={styles.closeBtn} onClick={onClose} type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.divider} />

            {/* Selected tests preview */}
            <div className={styles.testsList}>
              <p className={styles.testsLabel}>Selected Tests</p>
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

            {/* Form */}
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Asel Nurlanovna"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="+7 777 000 00 00"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Branch</label>
                <select
                  className={styles.input}
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                >
                  <option value="">Select a branch...</option>
                  {BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {express && (
                <div className={styles.expressTag}>
                  ⚡ Express order — results delivered faster
                </div>
              )}

              {error && (
                <div className={styles.errorBox}>
                  <span>⚠</span>
                  <p>{error}</p>
                </div>
              )}

              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{total.toLocaleString()} ₸</strong>
              </div>

              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading}
                type="button"
              >
                {loading ? "Submitting..." : "Confirm Order"}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>Order Submitted!</h3>
            <p className={styles.successSub}>
              Your order has been sent to the lab. They will contact you shortly.
            </p>
            {pdfUrl && (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.pdfBtn}>
                Download Order PDF →
              </a>
            )}
            <button className={styles.submitBtn} onClick={onClose} type="button">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}