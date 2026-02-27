"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import styles from "./page.module.css";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const loading = form.formState.isSubmitting;

  async function onSubmit({ email }: ForgotPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset",
    });

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      setSuccess("If an account exists for this email, we've sent a password reset link.");
      form.reset();
    }
    form.reset()
  }

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>Forgot Password</h1>
        <p className={styles.bannerDesc}>
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <div className={styles.lockIcon}>🔑</div>
          </div>
          <h2 className={styles.cardTitle}>Reset Password</h2>
          <p className={styles.cardDesc}>
            Enter the email address associated with your ImmunoLab account.
          </p>
          <hr className={styles.divider} />

          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className={styles.error}>{form.formState.errors.email.message}</p>
              )}
            </div>

            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className={styles.homeLink}>
            <Link href="/login">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}