"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "@/app/verify-email/page.module.css";

export function ResendVerificationButton({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resendVerificationEmail() {
    if (!email) {
      setError("No email found for this user");
      return;
    }

    setSuccess(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await (authClient as any).sendVerificationEmail?.({
        email,
        callbackURL: "/email-verified",
      });

      if (result?.error) {
        setError(result.error.message || "Something went wrong");
      } else {
        setSuccess("Verification email sent successfully");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {success && <p style={{ color: "green", marginBottom: 8 }}>{success}</p>}
      {error && <p style={{ color: "red", marginBottom: 8 }}>{error}</p>}

      <button
        type="button"
        className={styles.resendBtn}
        onClick={resendVerificationEmail}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Resend Verification Email"}
      </button>
    </div>
  );
}