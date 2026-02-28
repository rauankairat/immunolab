"use client";

import { useState } from "react";
import styles from "./page.module.css";

const PRICE_PER_ITEM = 6500;
const EXPRESS_FEE = 1500;

const products = [
  { id: 1, name: "Articaine Hydrochloride 4%, Huons Co., Ltd., Korea", description: "Local anesthetic commonly used for dental procedures." },
  { id: 2, name: "Articaine 4% + Epinephrine 1:100 000, Spain, INIBSA", description: "Anesthetic with vasoconstrictor for longer-lasting effect." },
  { id: 3, name: "Mepivastesin 3%, 3M ESPE, Germany", description: "Intermediate-acting local anesthetic for minor dental treatments." },
  { id: 4, name: "Orabloc 1:100 000 / Red, Pierrel S.P.A., Italy", description: "Contains epinephrine for extended anesthesia." },
  { id: 5, name: "Orabloc 1:200 000 / Blue, Pierrel S.P.A., Italy", description: "Milder epinephrine content for sensitive patients." },
  { id: 6, name: "Septanest with Adrenaline 1:100 000, Blue, Septodont, France", description: "High potency dental anesthetic with adrenaline." },
  { id: 7, name: "Septanest with Adrenaline 1:200 000, Green, Septodont, France", description: "Lower adrenaline concentration for safer use." },
  { id: 8, name: "Ubistesin 4% Forte, 3M ESPE, Germany", description: "Strong anesthetic for longer procedures." },
  { id: 9, name: "Ubistesin 4%, 3M ESPE, Germany / Red", description: "Standard dental anesthetic with moderate potency." },
  { id: 10, name: "c 68 Ultracaine / Articaine", description: "Rapid onset anesthetic for minor dental work." },
  { id: 11, name: "c 88 Mepivacaine", description: "Commonly used local anesthetic, moderate duration." },
  { id: 12, name: "c 82 Lidocaine", description: "Classic dental anesthetic, widely used." },
  { id: 13, name: "c 83 Novocaine", description: "Older anesthetic, mild effect, limited use today." },
  { id: 14, name: "c 196 Epinephrine", description: "Vasoconstrictor often combined with anesthetics." },
  { id: 15, name: "c 206 Cephalosporin", description: "Antibiotic for bacterial infections." },
  { id: 16, name: "c 204 Amoxicillin", description: "Broad-spectrum antibiotic." },
  { id: 17, name: "c 281 Diclofenac", description: "Anti-inflammatory and pain relief." },
  { id: 18, name: "c 286 Ibuprofen", description: "Painkiller and anti-inflammatory." },
  { id: 19, name: "c 194 Azithromycin", description: "Antibiotic for respiratory and skin infections." },
  { id: 20, name: "c 172 Ketoprofen", description: "Nonsteroidal anti-inflammatory drug." },
  { id: 21, name: "c 20 Paracetamol", description: "Analgesic and antipyretic drug." },
];

export default function OrderPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [express, setExpress] = useState(false);

  const toggleProduct = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const quantity = selected.length;
  const pricePerItem = PRICE_PER_ITEM + (express ? EXPRESS_FEE : 0);
  const total = quantity * pricePerItem;

  return (
    <div className={styles.outerBox}>
      
      {/* PRODUCT DESCRIPTIONS ABOVE CALCULATOR */}
      <div className={styles.catalogWrapper}>
        <h2>Available Products</h2>
        <div className={styles.catalogGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.catalogCard}>
              <strong>{product.name}</strong>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EXISTING CALCULATOR / ORDER PANEL */}
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Order Panel</h1>
          <p>Select products for analysis</p>
        </div>

        <div className={styles.layout}>
          {/* PRODUCTS SELECTION */}
          <div className={styles.products}>
            {products.map(product => {
              const isSelected = selected.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`${styles.productCard} ${isSelected ? styles.selected : ""}`}
                >
                  <span>{product.name}</span>
                  <div className={styles.checkbox}>{isSelected && <div className={styles.checkmark} />}</div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <div className={styles.priceInfo}>
                <span>Price per item</span>
                <strong>{pricePerItem.toLocaleString()} ₸</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Quantity</span>
                <strong>{quantity}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>{(quantity * PRICE_PER_ITEM).toLocaleString()} ₸</strong>
              </div>

              {express && (
                <div className={styles.summaryRow}>
                  <span>Express surcharge</span>
                  <strong>{(quantity * EXPRESS_FEE).toLocaleString()} ₸</strong>
                </div>
              )}

              <div className={styles.expressOption}>
                <label>
                  <input type="checkbox" checked={express} onChange={() => setExpress(!express)} />
                  Express result (+{EXPRESS_FEE.toLocaleString()} ₸ per item)
                </label>
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{total.toLocaleString()} ₸</strong>
              </div>

              <button className={styles.orderButton} disabled={quantity === 0}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}