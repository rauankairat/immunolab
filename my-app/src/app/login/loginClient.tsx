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
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.shell}>
        <section className={styles.left}>
          <h1 className={styles.welcome}>
            {props.welcome}
            {props.welcomeLine2 && <><br />{props.welcomeLine2}</>}
          </h1>
          <p className={styles.sub}>{props.sub}</p>
        </section>

        <section className={styles.right}>
          <div className={styles.glass}>
            <div className={styles.card}>
              <h2 className={styles.title}>{props.title}</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.field}>
                  <label className={styles.label}>{props.emailLabel}</label>
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
                  <label className={styles.label}>{props.passwordLabel}</label>
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
                      {props.forgotPassword}
                    </Link>
                  </div>
                </div>

                {serverError && (
                  <div className={styles.serverError}>{serverError}</div>
                )}

                <button type="submit" disabled={isSubmitting} className={styles.submit}>
                  {isSubmitting ? props.signingIn : props.signInLabel}
                </button>
              </form>

              <p className={styles.signup}>
                {props.noAccount}{" "}
                <Link href="/register" className={styles.signupLink}>
                  {props.registerLabel}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}