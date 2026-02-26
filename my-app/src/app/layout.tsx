import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import NavAuth from "./components/NavAuth";
import NavLinks from "./components/NavLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immuno Lab",
  description: "Manage your allergy tests",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
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
              padding: "0 40px",
            }}>
              {/* Logo */}
              <Link href="/" style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}>
                <Image
                  src="/logo.png"   
                  alt="ImmunoLab Logo"
                  width={200}            
                  height={200}
                  style={{ objectFit: "contain" }}
                />
                <span style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  fontFamily: "Poppins, Helvetica, sans-serif",
                }}>
                  ImmunoLab
                </span>
              </Link>

              {/* Center links with sliding underline */}
              <NavLinks />

              {/* Auth */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <NavAuth />
              </div>
            </nav>
          </header>

          <main className="flex-grow">{children}</main>

          <footer style={{
            backgroundColor: "#1a5319",
            padding: "40px",
          }}>
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
              <div>
                <p style={{ margin: "0 0 6px 0", color: "#ffffff", fontSize: "15px", fontWeight: 600, fontFamily: "Poppins, Helvetica, sans-serif" }}>
                  allergoexpressmed@gmail.com
                </p>
                <p style={{ margin: 0, color: "#ffffff", fontSize: "15px", fontWeight: 600, fontFamily: "Poppins, Helvetica, sans-serif" }}>
                  +7 707 566 88 99
                </p>
              </div>
              <div style={{ display: "flex", gap: "32px" }}>
                <Link href="/privacy" style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", fontWeight: 600, textDecoration: "none", fontFamily: "Poppins, Helvetica, sans-serif" }}>
                  Privacy Policy
                </Link>
                <Link href="/terms" style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", fontWeight: 600, textDecoration: "none", fontFamily: "Poppins, Helvetica, sans-serif" }}>
                  Terms
                </Link>
              </div>
            </div>
          </footer>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}