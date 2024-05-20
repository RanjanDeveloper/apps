import { db } from "@/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (verificationToken, { eq }) => eq(verificationToken.token, token),
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (verificationToken, { eq }) => eq(verificationToken.email, email),
    });
    return verificationToken;
  } catch {
    return null;
  }
};
