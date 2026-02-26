import styles from "./page.module.css";
import ImagePopup from "./components/ImagePopup";

export default function Home() {
  return (
    <div className={styles.home}>
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
      <h1>ImmunoLab</h1>
    </div>
  </div>
</div>
  );
}