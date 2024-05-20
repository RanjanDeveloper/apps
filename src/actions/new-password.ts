"use server";
import { passwordResetToken, user } from '@/db/schemas';
import bcrypt  from 'bcryptjs';
import { getUserByEmail } from "@/data/users";
import { getPasswordResetTokenByToken } from "../data/password-reset-tokens";
import { NewPasswordSchema } from "@/schemas";
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';


export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validateFields = NewPasswordSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { password } = validateFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }
  const hasExpired = new Date(existingToken.expires!) < new Date();
  if(hasExpired){
    return {error:'Token has expired!'}
  }
  const existingUser = await getUserByEmail(existingToken.email!);
  if(!existingUser){
    return {error:'Email does not exist!'}
  }

  const hashedPassword = await bcrypt.hash(password,10);
  await db.update(user).set({password:hashedPassword}).where(eq(user.id,existingUser.id));

  await db.delete(passwordResetToken).where(eq(passwordResetToken.id,existingToken.id));

  return{success:'Password updated!'}
};
