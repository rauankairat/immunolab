"use client";
import { useActionState } from "react";
import styles from "./page.module.css";
import { actions } from "../data/actions";
import { type FormState } from "../data/validation/auth";
import { ZodErrors } from "../components/custom/zod-errors";


export default function Register() {

    const INITIAL_STATE = {
      success: false,
      message: undefined,
      strapiErrors: null,
      zodErrors: null,
    };

    const [formState, formAction] = useActionState(
        actions.auth.registerUserAction,
        INITIAL_STATE
    );

    console.log("## will render on client ##");
    console.log(formState);
    console.log("###########################");

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

        <form action={formAction}>
          <label className={styles.label}>Username</label>
          <input className={styles.input} type="text" name="username" placeholder="Email or mobile number" defaultValue={formState?.data?.username || ""}/>
          <ZodErrors error={formState?.zodErrors?.username} />

          <label className={styles.label}>Password</label>
          <input className={styles.input} type="password" name="password" placeholder="Enter your password" defaultValue={formState?.data?.password || ""} />
          <ZodErrors error={formState?.zodErrors?.password} />

          <label className={styles.label}>re-enter Password</label>
          <input className={styles.input} type="password" name="confirmPassword" placeholder="Enter your password" />

          <button className={styles.button} type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
