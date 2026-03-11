"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPoller() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/check-verified");
        const data = await res.json();
        if (data.verified) {
          clearInterval(interval);
          router.push("/");
          router.refresh();
        }
      } catch {
        // silently ignore network errors
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return null;
}