"use client";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./page.module.css";
import { authClient } from "@/lib/auth-client";
import { SignupFormSchema } from "@/app/data/validation/auth";

// tell react-hook-form what shape the data is
type SignUpValues = z.infer<typeof SignupFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loading = form.formState.isSubmitting;

  async function onSubmit({ name, email, password }: SignUpValues) {
    setError(null);

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/email-verified",
    }, {
      // This allows you to see the error in the browser console
      onRequest: (ctx) => console.log("Requesting...", ctx),
      onError: (ctx) => {
        console.error("Signup Error Detail:", ctx.error); // Check your browser console!
        setError(ctx.error.message || "Sign up failed");
      },
      onSuccess: (ctx) => {
        toast.success("Signed up successfully");
        router.push("/home");
      }
    });
}

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create account</h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            placeholder="John Doe"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className={styles.error}>{form.formState.errors.name.message}</p>
          )}

          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="you@email.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className={styles.error}>{form.formState.errors.email.message}</p>
          )}

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className={styles.error}>{form.formState.errors.password.message}</p>
          )}

          <label className={styles.label}>Confirm Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className={styles.error}>{form.formState.errors.confirmPassword.message}</p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button 
            className={styles.button} 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className={styles.footer}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}