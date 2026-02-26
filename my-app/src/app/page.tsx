import styles from "./page.module.css";
import ImagePopup from "./components/ImagePopup";

export default function Home() {
  return (
    <div className={styles.home}>

      {/* ── Video Hero ── */}
      <div className={styles.videoCard}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.backgroundVideo}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className={styles.bottomFade} />
        <div className={styles.brand}>
          <h1>Get Your Allergo Test</h1>
          <div className={styles.ctaButtons}>
            <a href="/register" className={styles.primaryButton}>Get Started</a>
            <a href="/about" className={styles.secondaryButton}>Learn More</a>
          </div>

        </div>
      </div>

      {/* ── Hero Section (light green wave bg) ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Structured Clinical Data.<br />
            Smarter Decisions.
          </h1>
          <p className={styles.heroDesc}>
            ImmunoLab securely collects, standardizes, and manages laboratory
            and clinical data for healthcare teams and researchers.
          </p>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section className={styles.whatWeDoSection}>
        <h2 className={styles.sectionTitle}>What We Do</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Secure Data Collection</h3>
            <p className={styles.featureDesc}>Encrypted lab &amp; clinical data capture</p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Structured Data Management</h3>
            <p className={styles.featureDesc}>Standardize formats &amp; improve accuracy</p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Intelligent Accessibility</h3>
            <p className={styles.featureDesc}>Real-time secure access</p>
          </article>
        </div>
      </section>

      <hr className={styles.divider} aria-hidden="true" />

      {/* ── Why ImmunoLab ── */}
      <section className={styles.whySection}>
        <div className={styles.whyLeft}>
          <h2 className={styles.whyTitle}>Why ImmunoLab ?</h2>
          <ul className={styles.whyList}>
            {[
              "99.9% Data Integrity",
              "HIPAA-Ready Architecture",
              "Secure Cloud Infrastructure",
              "Research-Grade Data Structuring",
            ].map((item) => (
              <li key={item} className={styles.whyItem}>
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" fill="#4a7c59" />
                  <path d="M7 12.5l3.5 3.5 6-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.whyRight} aria-hidden="true" />
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to improve your clinical workflow ?</h2>
        <a href="#create-account" className={styles.createAccountButton}>Create an Account</a>
      </section>

    </div>
  );
}