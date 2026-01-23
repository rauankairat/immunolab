import styles from "./page.module.css";
import Link from "next/link";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log in</h1>

        <label className={styles.label}>Username</label>
        <input className={styles.input} type="text" placeholder="Email or mobile number" />

        <label className={styles.label}>Password</label>
        <input className={styles.input} type="password" placeholder="Enter your password" />

        <button className={styles.button}>Sign in</button>
        <div className={styles.label}><Link href="/register">Don't have an account? Sign up now!</Link></div>
      </div>
    </div>
  );
}
