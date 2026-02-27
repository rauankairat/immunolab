import styles from "./page.module.css";
import type  {Metadata} from "next"

export const metadata: Metadata = {
  title: "About — ImmunoLab",
  description:
    "AllergoExpress Immunolab specializes in express diagnosis of allergies to local anesthetics and antibiotics with same-day results.",
};

const features = [
  {
    title: "ELISA-Based Diagnostics",
    desc: "Our laboratory uses enzyme-linked immunosorbent assay (ELISA) — one of the most reliable methods available for allergen detection.",
  },
  {
    title: "Multiple Branches in Almaty",
    desc: "Conveniently located across the city so you can access our services without long commutes.",
  },
  {
    title: "Accurate, Fast & Affordable",
    desc: "Our goal is to make professional allergy diagnosis accessible to everyone — without compromising quality.",
  },
];

const specializations = [
  {
    icon: "💉",
    name: "Local Anesthetics",
    desc: "Articaine, Lidocaine, Bupivacaine, and more",
  },
  {
    icon: "💊",
    name: "Antibiotics",
    desc: "Penicillin-group, Cephalosporins, Macrolides",
  },
  {
    icon: "🧬",
    name: "ELISA Method",
    desc: "High-sensitivity immunological testing",
  },
  {
    icon: "📋",
    name: "Same-Day Results",
    desc: "Results issued on the day of sampling (before 12:00)",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>About the Laboratory</span>
          <h1 className={styles.heroTitle}>
            AllergoExpress&nbsp;Immunolab
          </h1>
          <p className={styles.heroSubtitle}>
            A modern diagnostic laboratory in Almaty specializing in express
            allergy testing for local anesthetics and antibiotics — with
            industry-leading accuracy and same-day results.
          </p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className={styles.strip}>
        <div className={styles.stripInner}>
          <div className={styles.stat}>
            <span className={styles.statValue}>88–95%</span>
            <span className={styles.statLabel}>Diagnostic accuracy</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>Same&nbsp;day</span>
            <span className={styles.statLabel}>Results (if sampled before noon)</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>ELISA</span>
            <span className={styles.statLabel}>Gold-standard testing method</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>Almaty</span>
            <span className={styles.statLabel}>Multiple branches across the city</span>
          </div>
        </div>
      </section>

      {/* ── About + Features ── */}
      <section className={styles.content}>
        {/* Left: about text */}
        <div className={styles.about}>
          <p className={styles.sectionLabel}>Who we are</p>
          <h2 className={styles.aboutTitle}>
            Precision allergy diagnostics you can rely on
          </h2>
          <p className={styles.aboutText}>
            AllergoExpress Immunolab is a specialized medical laboratory focused
            on the express diagnosis of allergic reactions to local anesthetics
            and antibiotics. We work closely with clinics, dentists, and
            individual patients across Almaty to provide timely, accurate
            results that directly inform treatment decisions.
          </p>
          <p className={styles.aboutText}>
            Allergic reactions to anesthetics and antibiotics can be
            life-threatening if not identified in advance. Our mission is to
            eliminate that uncertainty — quickly, reliably, and at a price that
            doesn't create barriers to care.
          </p>
          <div className={styles.highlightBox}>
            <p>
              All testing is performed using the ELISA method — an
              internationally recognized immunological technique offering
              sensitivity and specificity that surpass many conventional
              allergy skin tests.
            </p>
          </div>
        </div>

        {/* Right: numbered features */}
        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>What sets us apart</h3>
          <div className={styles.featureList}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <div className={styles.featureNumber}>{i + 1}</div>
                <div className={styles.featureText}>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specializations ── */}
      <section className={styles.specSection}>
        <div className={styles.specInner}>
          <h2 className={styles.specTitle}>Our Specializations</h2>
          <div className={styles.specGrid}>
            {specializations.map((s, i) => (
              <div key={i} className={styles.specCard}>
                <div className={styles.specIcon}>{s.icon}</div>
                <p className={styles.specName}>{s.name}</p>
                <p className={styles.specDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}