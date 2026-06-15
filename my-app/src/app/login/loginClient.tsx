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
import Image from "next/image"

const schema = z.object({
  identifier: z.string().min(1, "Required field"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

type Props = {
  welcome: string
  welcomeLine2: string
  sub: string
  title: string
  emailLabel: string
  passwordLabel: string
  forgotPassword: string
  signingIn: string
  signInLabel: string
  noAccount: string
  registerLabel: string
  successToast: string
}

export default function LoginPage(props: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "", remember: false },
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
      toast.success(props.successToast)
      router.push("/account")
      router.refresh()
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>

        {/* Left branding panel */}
        <section className={styles.left}>
          {/* Floating orbs */}
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
          <div className={`${styles.orb} ${styles.orb4}`} />
          {/* Grid overlay */}
          <div className={styles.grid} />

          <div className={styles.leftInner}>
            <div className={styles.logoWrap}>
              <div className={styles.logoPulse}>
                <Image src="/logo.png" alt="ImmunoLab" width={72} height={72} className={styles.logoImg} />
              </div>
              <span className={styles.logoName}>ImmunoLab</span>
            </div>

            <h1 className={styles.welcome}>
              {props.welcome}
              {props.welcomeLine2 && (
                <><br /><span className={styles.welcomeAccent}>{props.welcomeLine2}</span></>
              )}
            </h1>

            <p className={styles.sub}>{props.sub}</p>

            <ul className={styles.features}>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Certified laboratory results
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Secure encrypted patient portal
              </li>
              <li className={styles.feature}>
                <span className={styles.featureIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                Results delivered within 24 hours
              </li>
            </ul>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>10k+</span>
                <span className={styles.statLabel}>Patients</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>99%</span>
                <span className={styles.statLabel}>Accuracy</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>24h</span>
                <span className={styles.statLabel}>Results</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right form panel */}
        <section className={styles.right}>
          <div className={styles.card}>

            <div className={styles.cardHeader}>
              <div className={styles.cardLogoWrap}>
                <Image src="/logo.png" alt="" width={52} height={52} className={styles.cardLogo} />
              </div>
              <h2 className={styles.title}>{props.title}</h2>
              <p className={styles.titleSub}>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              <div className={styles.field}>
                <label className={styles.label}>{props.emailLabel}</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="text"
                    autoComplete="username"
                    className={styles.input}
                    placeholder="you@example.com"
                    {...register("identifier")}
                  />
                </div>
                {errors.identifier && (
                  <div className={styles.error}>{errors.identifier.message}</div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>{props.passwordLabel}</label>
                  <Link href="/forgot-password" className={styles.forgotLink}>
                    {props.forgotPassword}
                  </Link>
                </div>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={styles.input}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className={styles.error}>{errors.password.message}</div>
                )}
              </div>

              {serverError && (
                <div className={styles.serverError}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {serverError}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className={styles.submit}>
                <span className={styles.submitBg} />
                <span className={styles.submitContent}>
                  {isSubmitting ? (
                    <><span className={styles.spinner} />{props.signingIn}</>
                  ) : props.signInLabel}
                </span>
              </button>
            </form>

            <p className={styles.signup}>
              {props.noAccount}{" "}
              <Link href="/register" className={styles.signupLink}>
                {props.registerLabel}
              </Link>
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
