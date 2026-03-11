"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPoller({ email }: { email: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!email) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/check-verified?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.verified) {
          clearInterval(interval);
          router.push("/");
          router.refresh();
        }
      } catch {
        // ignore
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [email]);

  return null;
}