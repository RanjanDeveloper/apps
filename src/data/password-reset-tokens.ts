import { db } from "@/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.passwordResetToken.findFirst({
      where: (passwordResetToken, { eq }) => eq(passwordResetToken.token, token),
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.passwordResetToken.findFirst({
      where: (passwordResetToken, { eq }) => eq(passwordResetToken.email, email),
    });
    return verificationToken;
  } catch {
    return null;
  }
};
