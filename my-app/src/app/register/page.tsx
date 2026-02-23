'use client'

import styles from "./page.module.css"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

const schema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    identifier: z.string().min(1, "Required field"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      identifier: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)

    try {
     
      const result = await (authClient as any).signUp?.email?.({
        email: values.identifier,
        password: values.password,
        name: values.name,
      })

      if (result?.error) {
        const msg = result.error.message || "Registration failed"
        setServerError(msg)
        toast.error(msg)
        return
      }

      toast.success("Account created")
      router.push(`/verify-email?email=${values.identifier}`)
      router.refresh()
    } catch (e: any) {
      const msg = e?.message || "Registration failed"
      setServerError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.side}>
          <h1 className={styles.sideTitle}>Create Your Account</h1>
          <p className={styles.sideText}>
            Sign up to manage your tests and access personalized health insights.
          </p>
        </section>

        <div className={styles.wrapper}>
          <div className={styles.card}>
            <h2 className={styles.title}>Register</h2>
            <div className={styles.underline} />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <label className={styles.label}>Full Name</label>
              <input className={styles.input} type="text" {...register("name")} />
              {errors.name && <div className={styles.error}>{errors.name.message}</div>}

              <label className={styles.label}>Email / Phone Number / IIN</label>
              <input className={styles.input} type="text" {...register("identifier")} />
              {errors.identifier && (
                <div className={styles.error}>{errors.identifier.message}</div>
              )}

              <div className={styles.passRow}>
                <label className={styles.label}>Password</label>
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>

              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              {errors.password && <div className={styles.error}>{errors.password.message}</div>}

              <label className={styles.label}>Confirm Password</label>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <div className={styles.error}>{errors.confirmPassword.message}</div>
              )}

              {serverError && <div className={styles.errorCenter}>{serverError}</div>}

              <button className={styles.button} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </form>

            <div className={styles.bottomText}>
              Already have an account ?{" "}
              <Link href="/login" className={styles.bottomLink}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}