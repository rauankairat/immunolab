import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import NavAuth from "./components/NavAuth";
import LanguageSelector from "./components/LanguageSelector";
import NavShell from "./components/NavShell";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Immuno Lab",
  description: "Manage your allergy tests",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "en";
  const t = await getTranslations("nav");

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col antialiased ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <NavShell
            labels={{
              search: t("search"),
              order: t("order"),
              team: t("team"),
              contact: t("contact"),
              about: t("about"),
            }}
            authSlot={<NavAuth />}
            langSlot={<LanguageSelector current={locale} />}
          />

          <main className="flex-grow">{children}</main>

          <footer style={{ backgroundColor: "#1a5319", padding: "40px" }}>
            <div style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
              <div>
                <p style={{ margin: "0 0 6px 0", color: "#fff", fontSize: "15px", fontWeight: 600, fontFamily: "Poppins, Helvetica, sans-serif" }}>
                  allergoexpressmed@gmail.com
                </p>
                <p style={{ margin: 0, color: "#fff", fontSize: "15px", fontWeight: 600, fontFamily: "Poppins, Helvetica, sans-serif" }}>
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