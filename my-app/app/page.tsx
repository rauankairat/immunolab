import styles from "./page.module.css";
import ImagePopup from "./components/ImagePopup";

export default function Home() {
  return (
    <div className = {styles.home}>
      <ImagePopup />
      <h1>Welcome to Immuno Lab!</h1>
    </div>
  );
}