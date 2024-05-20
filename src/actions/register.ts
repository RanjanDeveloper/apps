"use server";
import { RegisterSchema } from "@/schemas";
import { addUser, getUserByEmail } from "@/data/users";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import * as z from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {

 //validate fields
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  const { name, email, password } = validateFields.data;

  //check the existing user
  const existingUser =await getUserByEmail(email);
  if (existingUser) {
    return { error: "User is already exists" };
  }

  //add new user
  const user = await addUser(name, email, password);

  //verification token generate for email verification
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken?.email!,verificationToken?.token!)
  return {
    success: "Confirmation email sent!",
  };
};
