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
        <Link href="/login" className={styles.links}>Forgot Password?</Link>

        <button className={styles.button}>Sign in</button>
        <Link href="/register"className={styles.links}>Create an Account</Link>
      </div>
    </div>
  );
}
