import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ImmunoLab",
  description:
    "AllergoExpress Immunolab specializes in express diagnosis of allergies to local anesthetics and antibiotics with same-day results.",
};

export default async function AboutPage() {
  const t = await getTranslations("about");

  const features = [
    { title: t("list1_title"), desc: t("list1") },
    { title: t("list2_title"), desc: t("list2") },
    { title: t("list3_title"), desc: t("list3") },
  ];

  const specializations = [
    { icon: "💉", name: t("spec_list_title1"), desc: t("spec_list_text1") },
    { icon: "💊", name: t("spec_list_title2"), desc: t("spec_list_text2") },
    { icon: "🧬", name: t("spec_list_title3"), desc: t("spec_list_text3") },
    { icon: "📋", name: t("spec_list_title4"), desc: t("spec_list_text4") },
  ];

  return (
    <div className={styles.wrapper}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>{t("intro")}</span>
          <h1 className={styles.heroTitle}>AllergoExpress&nbsp;Immunolab</h1>
          <p className={styles.heroSubtitle}>{t("desc")}</p>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className={styles.strip}>
        <div className={styles.stripInner}>
          <div className={styles.stat}>
            <span className={styles.statValue}>88–95%</span>
            <span className={styles.statLabel}>{t("about_stat1")}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>Same&nbsp;day</span>
            <span className={styles.statLabel}>{t("about_stat2")}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{t("about_stat5")}</span>
            <span className={styles.statLabel}>{t("about_stat3")}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>Almaty</span>
            <span className={styles.statLabel}>{t("about_stat4")}</span>
          </div>
        </div>
      </section>

      {/* ── About + Features ── */}
      <section className={styles.content}>
        <div className={styles.about}>
          <p className={styles.sectionLabel}>{t("who")}</p>
          <h2 className={styles.aboutTitle}>{t("about_h1")}</h2>
          <p className={styles.aboutText}>{t("about_h1_text1")}</p>
          <p className={styles.aboutText}>{t("about_h1_text2")}</p>
          <div className={styles.highlightBox}>
            <p>{t("about_banner")}</p>
          </div>
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>{t("sets")}</h3>
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
          <h2 className={styles.specTitle}>{t("specializations")}</h2>
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