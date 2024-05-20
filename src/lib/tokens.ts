import crypto from "crypto";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { passwordResetToken, twoFactorToken, verificationToken } from "@/db/schemas";
import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "../data/verification-token";
import { getPasswordResetTokenByEmail } from "../data/password-reset-tokens";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const id = uuid();
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); //5 mins
  const existingToken = await getTwoFactorTokenByEmail(email);
  
  if (existingToken) {
    await db.delete(twoFactorToken).where(eq(twoFactorToken.id, existingToken.id));
  }
  const insertedId = await db.insert(twoFactorToken).values({
    id,
    email,
    token,
    expires,
  });
  const insertedToken = await db.query.twoFactorToken.findFirst({
    where: (twoFactorToken, { eq }) => eq(twoFactorToken.id, id),
  });
  return insertedToken;
};

export const generateResetPasswordToken = async (email: string) => {
  const id = uuid();
  const token = uuid();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000); // 60 mins
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.delete(passwordResetToken).where(eq(passwordResetToken.id, existingToken.id));
  }

  const insertedId = await db.insert(passwordResetToken).values({ id, email, token, expires });
  const insertedToken = await db.query.passwordResetToken.findFirst({
    where: (passwordResetToken, { eq }) => eq(passwordResetToken.id, id),
  });
  return insertedToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000); //60 mins
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.delete(verificationToken).where(eq(verificationToken.id, existingToken.id));
  }
  const id = uuid();
  const insertedId = await db.insert(verificationToken).values({ id, email, token, expires });

  const insertedToken = await db.query.verificationToken.findFirst({
    where: (verificationToken, { eq }) => eq(verificationToken.id, id),
  });
  return insertedToken;
};
