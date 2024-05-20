"use server";

import { db } from "@/db";
import { user, verificationToken } from "@/db/schemas";
import { getUserByEmail } from "@/data/users";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires!) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email!);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  //update the verification
  await db
    .update(user)
    .set({
      emailVerified: new Date(),
      email: existingToken.email!,
    })
    .where(eq(user.id, existingUser.id));

  //deleting the verification token
  await db.delete(verificationToken).where(eq(verificationToken.id, existingToken.id));

  return { success: "Email Verified!" };
};
