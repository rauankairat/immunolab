'use client'

import { toast } from "sonner"
import styles from "./page.module.css"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"

const schema = z.object({
  identifier: z.string().min(1, "Required field"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

function GoogleLogo() {
  return (
    <svg className={styles.googleSvg} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.687 32.657 29.28 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.013 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.277 4 24 4c-7.682 0-14.354 4.337-17.694 10.691z" />
      <path fill="#4CAF50" d="M24 44c5.175 0 9.86-1.984 13.409-5.214l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.259 0-9.657-3.324-11.29-7.962l-6.52 5.02C9.48 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.785 2.197-2.253 4.062-4.084 5.548l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit = async (values: FormValues) => {
  setServerError(null)

  const result = await authClient.signIn.email({
    email: values.identifier,
    password: values.password,
    rememberMe: values.remember,
  })

  if (result.error) {
    if (result.error.code === "EMAIL_NOT_VERIFIED") {
      router.push(`/verify-email?email=${values.identifier}`)
      return
    }
    const msg = result.error.message || "Login failed"
    setServerError(msg)
    toast.error(msg)
  } else {
    toast.success("Signed in successfully")
    router.push("/account")
    router.refresh()
  }
}

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.waveA} />
        <div className={styles.waveB} />
      </div>

      <div className={styles.shell}>
        <section className={styles.left}>
          <h1 className={styles.welcome}>Welcome<br />Back</h1>
          <p className={styles.sub}>
            Sign in to manage your orders and view your personalized results.
          </p>
        </section>

        <section className={styles.right}>
          <div className={styles.glass}>
            <div className={styles.card}>
              <h2 className={styles.title}>Sign In</h2>

              <button type="button" className={styles.googleBtn}>
                <GoogleLogo />
                <span>Sign In with Google</span>
              </button>

              <div className={styles.divider}>
                <span className={styles.line} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.line} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Email / Phone Number / IIN</label>
                  <input
                    type="text"
                    autoComplete="username"
                    className={styles.input}
                    {...register("identifier")}
                  />
                  {errors.identifier && (
                    <div className={styles.error}>{errors.identifier.message}</div>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    className={styles.input}
                    {...register("password")}
                  />
                  {errors.password && (
                    <div className={styles.error}>{errors.password.message}</div>
                  )}

                  <div className={styles.forgotRow}>
                    <Link href="/forgot-password" className={styles.forgotLink}>
                      Forgot Password ?
                    </Link>
                  </div>
                </div>

                {serverError && <div className={styles.serverError}>{serverError}</div>}

                <button type="submit" disabled={isSubmitting} className={styles.submit}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className={styles.signup}>
                Dont have an account ?{" "}
                <Link href="/register" className={styles.signupLink}>
                  Register
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}