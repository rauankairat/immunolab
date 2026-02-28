import styles from "./page.module.css";
import newStyles from "./homepage-additions.module.css";

export default function Home() {
  return (
    <div className={styles.home}>

      {/* -- Video Hero -- */}
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

      {/* -- [NEW] Ticker -- */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[
            "ALLERGEN PANEL", "IgE TESTING", "SKIN PRICK TEST", "FOOD SENSITIVITY",
            "DRUG ALLERGIES", "PATCH TESTING", "MOLD SPORES", "DUST MITES",
            "POLLEN SCREEN", "ANIMAL DANDER", "LATEX ALLERGY", "INSECT VENOM",
            "ALLERGEN PANEL", "IgE TESTING", "SKIN PRICK TEST", "FOOD SENSITIVITY",
            "DRUG ALLERGIES", "PATCH TESTING", "MOLD SPORES", "DUST MITES",
            "POLLEN SCREEN", "ANIMAL DANDER", "LATEX ALLERGY", "INSECT VENOM",
          ].map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              {item}
              <span className={styles.tickerDot}>&bull;</span>
            </span>
          ))}
        </div>
      </div>

{/* -- Hero Row -- */}
      <div className={styles.heroRow}>

        {/* existing */}
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

        {/* new: fast results */}
        <section className={styles.heroSectionAlt}>
          <div className={styles.heroAltTag}>Same-day results</div>
          <h2 className={styles.heroAltTitle}>
            Submitted before 12:00?<br />
            Ready today.
          </h2>
          <p className={styles.heroAltDesc}>
            Order online, walk into any of our 13 Almaty branches,
            and receive your structured IgE panel results the same afternoon.
          </p>
          <a href="/contact" className={styles.heroAltLink}>Find a branch &rarr;</a>
        </section>

        {/* new: secure access */}
        <section className={styles.heroSectionDark}>
          <div className={styles.heroAltTag} style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)" }}>Secure access</div>
          <h2 className={styles.heroAltTitleLight}>
            Your results.<br />
            Your account.
          </h2>
          <p className={styles.heroAltDescLight}>
            Every test is logged, structured, and waiting in your personal dashboard.
            Download, share with your doctor, or track over time.
          </p>
          <a href="/register" className={styles.heroAltLinkLight}>Create an account &rarr;</a>
        </section>

      </div>

      {/* -- [NEW] Stats strip -- */}
      <div className={styles.statsStrip}>
        <div className={styles.statsInner}>
          <div className={styles.stat}>
            <span className={styles.statNum}>13</span>
            <span className={styles.statLabel}>Branches across Almaty</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>21<span className={styles.statSup}>+</span></span>
            <span className={styles.statLabel}>Allergen panels available</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>Same<span className={styles.statSmall}>-day</span></span>
            <span className={styles.statLabel}>Results before 12:00</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>100<span className={styles.statSup}>%</span></span>
            <span className={styles.statLabel}>Secure digital delivery</span>
          </div>
        </div>
      </div>

      {/* -- What We Do -- */}
      <section className={styles.whatWeDoSection}>
        <h2 className={styles.sectionTitle}>What We Do</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Secure Data Collection</h3>
            <p className={styles.featureDesc}>Encrypted lab &amp; clinical data capture across all branch locations.</p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Structured Data Management</h3>
            <p className={styles.featureDesc}>Standardized formats that improve accuracy and eliminate transcription errors.</p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Intelligent Accessibility</h3>
            <p className={styles.featureDesc}>Real-time secure access to results for patients and clinicians alike.</p>
          </article>
        </div>
      </section>

      {/* -- [NEW] How it works -- */}
      <section className={styles.howSection}>
        <div className={styles.howInner}>
          <p className={styles.howEyebrow}>The process</p>
          <h2 className={styles.howTitle}>From sample to screen in hours.</h2>
          <div className={styles.howSteps}>
            {[
              { n: "01", title: "Order online", body: "Select your allergen panel through our portal. Same-day appointments available at all 13 branches." },
              { n: "02", title: "Sample collection", body: "Visit any branch. A qualified nurse collects your blood sample -- quick, clean, clinical." },
              { n: "03", title: "Lab analysis", body: "Your sample is processed in our certified immunology lab using IgE-specific testing methodology." },
              { n: "04", title: "Receive results", body: "Structured results delivered securely to your account. Download, share, or discuss with your doctor." },
            ].map((step) => (
              <div key={step.n} className={styles.howStep}>
                <span className={styles.howNum}>{step.n}</span>
                <div className={styles.howStepBody}>
                  <h3 className={styles.howStepTitle}>{step.title}</h3>
                  <p className={styles.howStepDesc}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- [NEW] Result preview -- */}
      <section className={styles.previewSection}>
        <div className={styles.previewInner}>
          <div className={styles.previewLeft}>
            <p className={styles.howEyebrow}>What you receive</p>
            <h2 className={styles.previewTitle}>Your results,<br />structured and clear.</h2>
            <p className={styles.previewDesc}>
              Every test result is structured, annotated, and immediately readable.
              No jargon. No guesswork. Share directly with your specialist.
            </p>
            <a href="/register" className={styles.previewCta}>Get your test &rarr;</a>
          </div>
          <div className={styles.previewRight}>
            {/* Mock result card */}
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div>
                  <p className={styles.resultPatientLabel}>Patient</p>
                  <p className={styles.resultPatient}>A. Seitkali</p>
                </div>
                <div className={styles.resultBadge}>IgE Panel</div>
              </div>
              <div className={styles.resultMeta}>
                <span>Sample received: 09:14</span>
                <span className={styles.resultSameDay}>Same-day result</span>
              </div>
              <div className={styles.resultRows}>
                {[
                  { name: "Cat dander (Fel d 1)", val: 3.8, unit: "kU/L", level: "High", pct: 76 },
                  { name: "House dust mite (Der p 1)", val: 2.1, unit: "kU/L", level: "Moderate", pct: 42 },
                  { name: "Birch pollen (Bet v 1)", val: 0.4, unit: "kU/L", level: "Low", pct: 8 },
                  { name: "Peanut (Ara h 2)", val: 0.1, unit: "kU/L", level: "Negative", pct: 2 },
                  { name: "Mold (Alternaria)", val: 1.6, unit: "kU/L", level: "Moderate", pct: 32 },
                ].map((row) => (
                  <div key={row.name} className={styles.resultRow}>
                    <div className={styles.resultRowTop}>
                      <span className={styles.resultName}>{row.name}</span>
                      <span className={`${styles.resultLevel} ${styles[`level${row.level}`]}`}>{row.level}</span>
                    </div>
                    <div className={styles.resultBar}>
                      <div className={styles.resultBarFill} style={{ width: `${row.pct}%`, opacity: row.pct > 50 ? 1 : row.pct > 20 ? 0.65 : 0.3 }} />
                    </div>
                    <span className={styles.resultVal}>{row.val} {row.unit}</span>
                  </div>
                ))}
              </div>
              <div className={styles.resultFooter}>
                Allergo Express Med &middot; Almaty, Kazakhstan
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.divider} aria-hidden="true" />
      
      {/* -- [NEW] Testimonial -- */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialInner}>
          <span className={styles.testimonialMark}>&ldquo;</span>
          <blockquote className={styles.testimonialQuote}>
            ImmunoLab has fundamentally changed how I communicate allergy data to my patients.
            Results arrive structured, annotated, and ready to act on -- no transcription, no ambiguity.
          </blockquote>
          <div className={styles.testimonialAuthor}>
            <div className={styles.testimonialAvatar}>:stethoscope:</div>
            <div>
              <p className={styles.testimonialName}>Dr. [Name]</p>
              <p className={styles.testimonialRole}>Allergist / Immunologist, Almaty</p>
            </div>
          </div>
        </div>
      </section>

      {/* -- Final CTA -- */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to improve your clinical workflow ?</h2>
        <a href="#create-account" className={styles.createAccountButton}>Create an Account</a>
      </section>

    </div>
  );
}