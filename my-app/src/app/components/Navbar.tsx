"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavBar.module.css";

type Labels = {
  order: string;
  team: string;
  contact: string;
  about: string;
};

export default function Navbar({
  locale,
  labels,
  authSlot,
  langSlot,
}: {
  locale: string;
  labels: Labels;
  authSlot: ReactNode;
  langSlot: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/orders", label: labels.order },
    { href: "/team", label: labels.team },
    { href: "/contact", label: labels.contact },
    { href: "/about", label: labels.about },
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.inner}>

          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
            <div className={styles.logoBox}>
              <Image
                src="/logo.png"
                alt="ImmunoLab"
                width={110}
                height={42}
                style={{ objectFit: "contain", width: "auto", height: "100%" }}
                priority
              />
            </div>
          </Link>

          {/* Desktop links */}
          <nav className={styles.desktopNav}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={styles.navLink}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className={styles.desktopRight}>
            {langSlot}
            {authSlot}
          </div>

          {/* Hamburger */}
          <button
            className={styles.burger}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            type="button"
          >
            <span className={`${styles.burgerLine} ${open ? styles.burgerLine1Open : ""}`} />
            <span className={`${styles.burgerLine} ${open ? styles.burgerLine2Open : ""}`} />
            <span className={`${styles.burgerLine} ${open ? styles.burgerLine3Open : ""}`} />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
          <nav className={styles.mobileNav}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileDivider} />
          <div className={styles.mobileBottom}>
            {langSlot}
            {authSlot}
          </div>
        </div>
      </header>

      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
    </>
  );
}