"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "./page.module.css";

type Labels = {
  sending: string;
  resend: string;
  success: string;
  error: string;
};

export function ResendVerificationButton({ email, labels }: { email: string; labels: Labels }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resendVerificationEmail() {
    setSuccess(null);
    setError(null);
    setIsLoading(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/email-verified",
    });
    setIsLoading(false);
    if (error) {
      setError(error.message || labels.error);
    } else {
      setSuccess(labels.success);
    }
  }

  return (
    <div>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className={styles.resendBtn}
        onClick={resendVerificationEmail}
        disabled={isLoading}
        type="button"
      >
        {isLoading ? labels.sending : labels.resend}
      </button>
    </div>
  );
}