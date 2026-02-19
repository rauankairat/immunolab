import { z } from "zod";

export const SignupFormSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Not be empty")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must be less than 40 characters")
      
      .regex(/[^a-zA-Z0-9]/, {
  message: "Contain at least one special character.",
}),

    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters")
      .max(100, "Confirm password must be less than 100 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export type FormState = {
  success?: boolean;
  message?: string;
  data?: {
    identifier?: string;
    username?: string;
    email?: string;
    password?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    identifier?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  } | null;
};