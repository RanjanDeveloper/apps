"use server";
import * as z from "zod";
import { ResetSchema } from "../schemas";
import { getUserByEmail } from "@/data/users";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email)!;

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generateResetPasswordToken(email);
  await sendPasswordResetEmail(passwordResetToken?.email!, passwordResetToken?.token!);

  return {
    success: "Reset email sent!",
  };
};
