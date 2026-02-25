import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      {/* Background decorative blobs */}
      <div className={styles.ellipse} aria-hidden="true" />
      <div className={styles.ellipseSecond} aria-hidden="true" />

      <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className={styles.hero} aria-labelledby="hero-heading">
          <h1 id="hero-heading" className={styles.heroTitle}>
            Structured Clinical Data.
          </h1>
          <p className={styles.heroSubtitle}>Smarter Decisions.</p>
          <p className={styles.heroBody}>
            ImmunoLab securely collects, standardizes, and manages laboratory
            and clinical data for healthcare teams and researchers.
          </p>
          <div className={styles.heroButtons}>
            <Link href="#get-started" className={styles.btnPrimary}>
              Get Started
            </Link>
            <Link href="#learn-more" className={styles.btnSecondary}>
              Learn More
            </Link>
          </div>
        </section>

        {/* ── WHAT WE DO ───────────────────────────────────── */}
        <section
          className={styles.whatWeDo}
          aria-labelledby="what-we-do-heading"
        >
          <h2 id="what-we-do-heading" className={styles.sectionHeading}>
            What We Do
          </h2>
          <div className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <div className={styles.featureIconPlaceholder} />
              <h3 className={styles.featureCardTitle}>Secure Data Collection</h3>
              <p className={styles.featureCardBody}>
                Encrypted lab &amp; clinical data capture
              </p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIconPlaceholder} />
              <h3 className={styles.featureCardTitle}>
                Structured Data Management
              </h3>
              <p className={styles.featureCardBody}>
                Standardize formats &amp; improve accuracy
              </p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIconPlaceholder} />
              <h3 className={styles.featureCardTitle}>
                Intelligent Accessibility
              </h3>
              <p className={styles.featureCardBody}>Real-time secure access</p>
            </article>
          </div>
        </section>

        {/* ── DIVIDER ──────────────────────────────────────── */}
        <div className={styles.divider} role="separator" aria-hidden="true" />

        {/* ── WHY IMMUNOLAB ────────────────────────────────── */}
        <section
          className={styles.whySection}
          aria-labelledby="why-immunolab-heading"
        >
          <div className={styles.whyLeft}>
            <h2 id="why-immunolab-heading" className={styles.sectionHeading}>
              Why ImmunoLab ?
            </h2>
            <ul className={styles.whyList}>
              <li className={styles.whyListItem}>
                <span className={styles.whyIcon} aria-hidden="true" />
                99.9% Data Integrity
              </li>
              <li className={styles.whyListItem}>
                <span className={styles.whyIcon} aria-hidden="true" />
                HIPAA-Ready Architecture
              </li>
              <li className={styles.whyListItem}>
                <span className={styles.whyIcon} aria-hidden="true" />
                Secure Cloud Infrastructure
              </li>
              <li className={styles.whyListItem}>
                <span className={styles.whyIcon} aria-hidden="true" />
                Research-Grade Data Structuring
              </li>
            </ul>
          </div>
          <div className={styles.whyRight}>
            <div className={styles.whyImagePlaceholder} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className={styles.cta} aria-labelledby="cta-heading">
          <h2 id="cta-heading" className={styles.ctaTitle}>
            Ready to improve your clinical workflow ?
          </h2>
          <Link href="#create-account" className={styles.ctaBtn}>
            Create an Account
          </Link>
        </section>

        {/* ── FIND US ──────────────────────────────────────── */}
        <section className={styles.findUs} aria-labelledby="find-us-heading">
          <div className={styles.findUsMapPlaceholder} />
          <div className={styles.findUsInfo}>
            <h2 id="find-us-heading" className={styles.findUsTitle}>
              Find Us
            </h2>
            <address className={styles.findUsAddress}>
              Astana, Kazakhstan
            </address>
            <Link href="#directions" className={styles.directionsBtn}>
              Get Directions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}