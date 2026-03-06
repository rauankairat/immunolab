"use client";

import { useState } from "react";
import styles from "./page.module.css";
import OrderModal from "./OrderModal";

const PRICE_PER_ITEM = 6500;
const EXPRESS_FEE = 1500;

type Product = {
  id: number;
  name: string;
  description: string;
};

export default function OrderClient({ list1, list2 }: { list1: Product[]; list2: Product[] }) {
  const [activeList, setActiveList] = useState<1 | 2>(1);
  const [selected1, setSelected1] = useState<number[]>([]);
  const [selected2, setSelected2] = useState<number[]>([]);
  const [express, setExpress] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const products = activeList === 1 ? list1 : list2;
  const selected = activeList === 1 ? selected1 : selected2;
  const setSelected = activeList === 1 ? setSelected1 : setSelected2;

  const toggleProduct = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const quantity = selected.length;
  const pricePerItem = PRICE_PER_ITEM + (express ? EXPRESS_FEE : 0);
  const total = quantity * pricePerItem;

  const selectedProducts = products.filter(p => selected.includes(p.id));

  return (
    <div className={styles.outerBox}>

      {/* CATALOG */}
      <div className={styles.catalogWrapper}>
        <h2>Available Products</h2>
        <div className={styles.listSwitcher} role="tablist" aria-label="Lists">
          <button
            type="button"
            onClick={() => setActiveList(1)}
            className={`${styles.switchBtn} ${activeList === 1 ? styles.switchBtnActive : ""}`}
            aria-selected={activeList === 1}
            role="tab"
          >
            Anesthetics & Antibiotics
          </button>
          <button
            type="button"
            onClick={() => setActiveList(2)}
            className={`${styles.switchBtn} ${activeList === 2 ? styles.switchBtnActive : ""}`}
            aria-selected={activeList === 2}
            role="tab"
          >
            Allergen Panel
          </button>
        </div>
        <div className={styles.catalogGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.catalogCard}>
              <strong>{product.name}</strong>
              {product.description && <p>{product.description}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ORDER PANEL */}
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

              <button
                className={styles.orderButton}
                disabled={quantity === 0}
                onClick={() => setModalOpen(true)}
                type="button"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER MODAL */}
      {modalOpen && (
        <OrderModal
          selectedProducts={selectedProducts}
          listType={activeList === 1 ? "Anesthetics & Antibiotics" : "Allergen Panel"}
          express={express}
          total={total}
          pricePerItem={pricePerItem}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}