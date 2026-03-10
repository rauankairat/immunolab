"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Labels = {
  search: string;
  order: string;
  team: string;
  contact: string;
  about: string;
};

export default function NavShell({
  labels,
  authSlot,
  langSlot,
}: {
  labels: Labels;
  authSlot: ReactNode;
  langSlot: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });
  const navLinksRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onResize() { if (window.innerWidth > 768) setOpen(false); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Set underline to active link on route change
  useEffect(() => {
    const container = navLinksRef.current;
    if (!container) return;
    const activeLink = container.querySelector<HTMLElement>("[data-active='true']");
    if (activeLink) {
      const containerRect = container.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setUnderline({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    } else {
      setUnderline(u => ({ ...u, opacity: 0 }));
    }
  }, [pathname]);

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>) {
    const container = navLinksRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const linkRect = e.currentTarget.getBoundingClientRect();
    setUnderline({
      left: linkRect.left - containerRect.left,
      width: linkRect.width,
      opacity: 1,
    });
  }

  function handleMouseLeave() {
    // Snap back to active link
    const container = navLinksRef.current;
    if (!container) return;
    const activeLink = container.querySelector<HTMLElement>("[data-active='true']");
    if (activeLink) {
      const containerRect = container.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setUnderline({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    } else {
      setUnderline(u => ({ ...u, opacity: 0 }));
    }
  }

  const links = [
    { href: "/orders",  label: labels.order },
    { href: "/team",    label: labels.team },
    { href: "/contact", label: labels.contact },
    { href: "/about",   label: labels.about },
  ];

  return (
    <header style={{
      backgroundColor: "#1a5319",
      position: "sticky",
      top: 0,
      zIndex: 50,
      width: "100%",
    }}>
      <nav style={{
        maxWidth: "1400px",
        margin: "0 auto",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}>
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          flexShrink: 0,
        }}>
          <Image
            src="/logo.png"
            alt="ImmunoLab Logo"
            width={200}
            height={200}
            style={{ objectFit: "contain", height: "48px", width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop center links */}
        <div
          ref={navLinksRef}
          className="nav-desktop-links"
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            gap: "36px",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Sliding underline */}
          <span style={{
            position: "absolute",
            bottom: "6px",
            height: "2px",
            background: "rgba(255,255,255,0.85)",
            borderRadius: "2px",
            left: underline.left,
            width: underline.width,
            opacity: underline.opacity,
            transition: "left 0.22s ease, width 0.22s ease, opacity 0.18s ease",
            pointerEvents: "none",
          }} />

          {/* Search pill — no underline */}
          <Link href="/search" style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#0b5b00",
            background: "rgba(255,255,255,0.92)",
            textDecoration: "none",
            padding: "8px 18px",
            borderRadius: "10px",
            whiteSpace: "nowrap",
            fontFamily: "Poppins, Helvetica, sans-serif",
          }}>
            {labels.search}
          </Link>

          {links.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                data-active={isActive ? "true" : "false"}
                onMouseEnter={handleMouseEnter}
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#ffffff",
                  textDecoration: "none",
                  fontFamily: "Poppins, Helvetica, sans-serif",
                  whiteSpace: "nowrap",
                  paddingBottom: "2px",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Desktop right */}
        <div className="nav-desktop-right" style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}>
          {langSlot}
          {authSlot}
        </div>

        {/* Hamburger */}
        <button
          className="nav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          type="button"
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "44px",
            height: "44px",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span style={{
            display: "block", width: "20px", height: "2px",
            background: "#fff", borderRadius: "2px",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
            transition: "transform 0.25s ease",
          }} />
          <span style={{
            display: "block", width: "20px", height: "2px",
            background: "#fff", borderRadius: "2px",
            opacity: open ? 0 : 1,
            transition: "opacity 0.2s ease",
          }} />
          <span style={{
            display: "block", width: "20px", height: "2px",
            background: "#fff", borderRadius: "2px",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            transition: "transform 0.25s ease",
          }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div style={{
        backgroundColor: "#1a5319",
        borderTop: open ? "1px solid rgba(255,255,255,0.1)" : "none",
        display: open ? "block" : "none",
      }}>
        <div style={{
          padding: "16px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          <Link href="/search" onClick={() => setOpen(false)} style={{
            fontSize: "15px", fontWeight: 700,
            color: "#0b5b00", background: "rgba(255,255,255,0.92)",
            textDecoration: "none", padding: "12px 16px",
            borderRadius: "8px", fontFamily: "Poppins, Helvetica, sans-serif",
            display: "block", marginBottom: "4px",
          }}>
            {labels.search}
          </Link>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              fontSize: "15px", fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              textDecoration: "none", padding: "12px 16px",
              borderRadius: "8px", fontFamily: "Poppins, Helvetica, sans-serif",
              display: "block",
            }}>
              {label}
            </Link>
          ))}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "4px 8px",
            flexWrap: "wrap",
          }}>
            {langSlot}
            {authSlot}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-right { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}