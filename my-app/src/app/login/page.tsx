'use client';
import { toast } from "sonner";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { setLazyProp } from "next/dist/server/api-utils";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      
    },
  });

  const loading = form.formState.isSubmitting;

  async function onSubmit({ email, password, rememberMe }: LoginValues) {
    setError(null)
    

    const {error} = await authClient.signIn.email({
      email,
      password,
      rememberMe
    })

    if(error){
      setError(error.message || "Something went wrong")
    }else{
      toast.success("Signed in successfully")
      router.push("/account")
    }
  }
   

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Log in</h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
            placeholder="Enter your password"
            {...form.register("password")}
          />
          
          {form.formState.errors.password && (
            <p className={styles.error}>{form.formState.errors.password.message}</p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <Link href="/forgot-password" className={styles.links}>
            Forgot Password?
          </Link>
          <label className={styles.label}>
          <input
            type="checkbox"
            {...form.register("rememberMe")}
            />
              Remember me
            </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className={styles.label}>
          <Link href="/register">
            Don't have an account?<br />Sign up now!
          </Link>
        </div>
      </div>
    </div>
  );
}