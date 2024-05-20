import { db } from "@/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.query.twoFactorConfirmation.findFirst({
      where: (twoFactorConfirmation, { eq }) => eq(twoFactorConfirmation.userId, userId),
    });
    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
