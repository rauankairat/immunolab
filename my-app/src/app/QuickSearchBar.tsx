"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function QuickSearchBar() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <div className={styles.quickSearchRow}>
      <input
        className={styles.quickSearchInput}
        type="text"
        inputMode="numeric"
        maxLength={10}
        placeholder="Enter your 10-digit test code"
        value={code}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          setCode(val);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && code.length === 10) {
            router.push(`/search?code=${code}`);
          }
        }}
      />
      <button
        className={styles.quickSearchBtn}
        onClick={() => {
          if (code.length === 10) router.push(`/search?code=${code}`);
        }}
        disabled={code.length !== 10}
      >
        Find Results
      </button>
    </div>
  );
}