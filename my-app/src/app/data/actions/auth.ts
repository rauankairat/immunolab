"use server";

import { z } from "zod";
import { SignupFormSchema, type FormState } from "../validation/auth";

export async function register(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),           
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"), 
  });

  console.log(validatedFields);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors,)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, confirmPassword } = validatedFields.data; 
  console.log(validatedFields); // now valid
}