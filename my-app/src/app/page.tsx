import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";

export default async function Home() {
  const t = await getTranslations("home");

  const steps = [
    { n: "01", title: t("process_subheading1"), body: t("process_subheading1_text") },
    { n: "02", title: t("process_subheading2"), body: t("process_subheading2_text") },
    { n: "03", title: t("process_subheading3"), body: t("process_subheading3_text") },
    { n: "04", title: t("process_subheading4"), body: t("process_subheading4_text") },
  ];

  const tickerItems = t.raw("moving_nav_bar") as string[];

  return (
    <div className={styles.home}>

      {/* -- Video Hero -- */}
      <div className={styles.videoCard}>
        <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className={styles.bottomFade} />
        <div className={styles.brand}>
          <h1>{t("title")}</h1>
          <div className={styles.ctaButtons}>
            <a href="/register" className={styles.primaryButton}>{t("get_started")}</a>
            <a href="/about" className={styles.secondaryButton}>{t("learn_more")}</a>
          </div>
        </div>
      </div>

      {/* -- Ticker -- */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {tickerItems.map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              {item}
              <span className={styles.tickerDot}>&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* -- Hero Row -- */}
      <div className={styles.heroRow}>
        <section className={styles.heroSection}>
          <div className={styles.heroAltTag}>{t("box1_header1")}</div>
          <h2 className={styles.heroAltTitle}>{t("box1_header2")}</h2>
          <p className={styles.heroAltDesc}>{t("box1_text")}</p>
          <a href="/about" className={styles.heroAltLink}>{t("box1_footer")} &rarr;</a>
        </section>

        <section className={styles.heroSectionAlt}>
          <div className={styles.heroAltTag}>{t("box2_header1")}</div>
          <h2 className={styles.heroAltTitle}>{t("box2_header2")}</h2>
          <p className={styles.heroAltDesc}>{t("box2_text")}</p>
          <a href="/contact" className={styles.heroAltLink}>{t("box2_footer")} &rarr;</a>
        </section>

        <section className={styles.heroSectionDark}>
          <div className={styles.heroAltTag} style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)" }}>
            {t("box3_header1")}
          </div>
          <h2 className={styles.heroAltTitleLight}>{t("box3_header2")}</h2>
          <p className={styles.heroAltDescLight}>{t("box3_text")}</p>
          <a href="/register" className={styles.heroAltLinkLight}>{t("box3_footer")} &rarr;</a>
        </section>
      </div>

      {/* -- Stats strip -- */}
      <div className={styles.statsStrip}>
        <div className={styles.statsInner}>
          <div className={styles.stat}>
            <span className={styles.statNum}>13</span>
            <span className={styles.statLabel}>{t("stat1")}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>21<span className={styles.statSup}>+</span></span>
            <span className={styles.statLabel}>{t("stat2")}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>Same<span className={styles.statSmall}>-day</span></span>
            <span className={styles.statLabel}>{t("stat3")}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>100<span className={styles.statSup}>%</span></span>
            <span className={styles.statLabel}>{t("stat4")}</span>
          </div>
        </div>
      </div>

      {/* -- What we do -- */}
      <section className={styles.whatWeDoSection}>
        <div className={styles.whatWeDoInner}>
          <p className={styles.whatWeDoTitle}>{t("what_we_do_title")}</p>
          <p className={styles.whatWeDoSubtitle}>{t("what_we_do_text")}</p>
          <div className={styles.whatWeDoGrid}>
            <div className={styles.whatWeDoItem}>
              <h3 className={styles.whatWeDoItemTitle}>{t("what_we_do_h1")}</h3>
              <p className={styles.whatWeDoItemDesc}>{t("what_we_do_h1_text")}</p>
            </div>
            <div className={styles.whatWeDoItem}>
              <h3 className={styles.whatWeDoItemTitle}>{t("what_we_do_h2")}</h3>
              <p className={styles.whatWeDoItemDesc}>{t("what_we_do_h2_text")}</p>
            </div>
            <div className={styles.whatWeDoItem}>
              <h3 className={styles.whatWeDoItemTitle}>{t("what_we_do_h3")}</h3>
              <p className={styles.whatWeDoItemDesc}>{t("what_we_do_h3_text")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* -- How it works -- */}
      <section className={styles.howSection}>
        <div className={styles.howInner}>
          <p className={styles.howEyebrow}>{t("the_process")}</p>
          <h2 className={styles.howTitle}>{t("process_text")}</h2>
          <div className={styles.howSteps}>
            {steps.map((step) => (
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

      {/* -- Result preview -- */}
      <section className={styles.previewSection}>
        <div className={styles.previewInner}>
          <div className={styles.previewLeft}>
            <p className={styles.howEyebrow}>{t("result_title")}</p>
            <h2 className={styles.previewTitle}>{t("result_text")}</h2>
            <p className={styles.previewDesc}>{t("result_subtext")}</p>
            <a href="/register" className={styles.previewCta}>{t("result_cta")} &rarr;</a>
          </div>
          <div className={styles.previewRight}>
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

      {/* -- Testimonial -- */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialInner}>
          <span className={styles.testimonialMark}>&ldquo;</span>
          <blockquote className={styles.testimonialQuote}>{t("quote")}</blockquote>
          <div className={styles.testimonialAuthor}>
            <div className={styles.testimonialAvatar}></div>
            <div>
              <p className={styles.testimonialName}>{t("quote_name")}</p>
              <p className={styles.testimonialRole}>{t("quote_name_profession")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* -- Final CTA -- */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>{t("improve")}</h2>
        <a href="#create-account" className={styles.createAccountButton}>{t("accc_creation")}</a>
      </section>

    </div>
  );
}