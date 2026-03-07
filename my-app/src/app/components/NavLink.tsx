"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

type Labels = {
  search: string;
  order: string;
  team: string;
  contact: string;
  about: string;
};

export default function NavLinks({ labels }: { labels: Labels }) {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const links = [
    { href: "/orders",  label: labels.order },
    { href: "/team",    label: labels.team },
    { href: "/contact", label: labels.contact },
    { href: "/about",   label: labels.about },
  ];

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    const parent = el.parentElement!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    setUnderlineStyle({ left: rect.left - parent.left, width: rect.width, opacity: 1 });
  }

  function handleMouseLeave() {
    setUnderlineStyle(prev => ({ ...prev, opacity: 0 }));
  }

  function handleSearch() {
    if (code.length === 10) {
      router.push(`/search?code=${code}`);
      setSearchOpen(false);
      setCode("");
    }
  }

  return (
    <div
      style={{ display: "flex", gap: "48px", position: "relative" }}
      onMouseLeave={() => { handleMouseLeave(); setSearchOpen(false); }}
    >
      {/* Search dropdown item */}
      <div className={styles.searchItem}>
        <Link href="/search" onMouseEnter={handleMouseEnter} className={styles.searchTrigger}>{labels.search}</Link>
        <div className={styles.searchPopover}>
          <div className={styles.searchPopoverInner}>
            <input
              className={styles.navSearchInput}
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit test code"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button
              className={styles.navSearchBtn}
              onClick={handleSearch}
              disabled={code.length !== 10}
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Other links — unchanged */}
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onMouseEnter={handleMouseEnter}
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#ffffff",
            textDecoration: "none",
            fontFamily: "Poppins, Helvetica, sans-serif",
            paddingBottom: "4px",
          }}
        >
          {label}
        </Link>
      ))}

      {/* Sliding underline — unchanged */}
      <span style={{
        position: "absolute",
        bottom: 0,
        left: underlineStyle.left,
        width: underlineStyle.width,
        height: "2px",
        backgroundColor: "#ffffff",
        opacity: underlineStyle.opacity,
        transition: "left 0.25s ease, width 0.25s ease, opacity 0.2s ease",
        pointerEvents: "none",
      }} />
    </div>
  );
}