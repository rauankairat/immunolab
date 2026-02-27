"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./page.module.css";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const loading = form.formState.isSubmitting;

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      setSuccess("Password has been reset. Redirecting to sign in...");
      form.reset();
      setTimeout(() => router.push("/login"), 3000);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <h1 className={styles.bannerTitle}>Reset Password</h1>
        <p className={styles.bannerDesc}>
          Create a new password for your ImmunoLab account.
        </p>
      </div>
      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <div className={styles.lockIcon}>🔒</div>
          </div>
          <h2 className={styles.cardTitle}>Create New Password</h2>
          <p className={styles.cardDesc}>
            Your new password must be at least 8 characters long.
          </p>
          <hr className={styles.divider} />
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter new password"
                autoComplete="new-password"
                {...form.register("newPassword")}
              />
              {form.formState.errors.newPassword && (
                <p className={styles.error}>{form.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Confirm new password"
                autoComplete="new-password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className={styles.error}>{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Resetting..." : "Reset Password"}
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