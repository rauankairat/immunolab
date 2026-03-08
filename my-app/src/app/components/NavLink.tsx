"use client";
import Link from "next/link";
import { useState } from "react";
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

  return (
    <div
      style={{ display: "flex", gap: "48px", alignItems: "center", position: "relative" }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Search — white pill, excluded from underline hover */}
      <Link href="/search" className={styles.searchCta}>
        {labels.search}
      </Link>

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