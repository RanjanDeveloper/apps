import { db } from "@/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorToken.findFirst({
        where : (twoFactorToken,{eq}) => eq(twoFactorToken.token,token)
    })
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
      const twoFactorToken = await db.query.twoFactorToken.findFirst({
          where : (twoFactorToken,{eq}) => eq(twoFactorToken.email,email)
      })
      return twoFactorToken;
    } catch {
      return null;
    }
  };
