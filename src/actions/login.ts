"use server";
import { twoFactorToken as TwoFactorTokenSchema, twoFactorConfirmation } from "@/db/schemas";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { LoginSchema } from "@/schemas";
import { db } from "@/db";
import { getUserByEmail } from "@/data/users";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { signIn } from "@root/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@root/routes";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { v4 as uuid } from "uuid";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>,callbackUrl?:string | null) => {
  //^ validate fields
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  const { email, password, code } = validateFields.data;
console.log({validateFields})
  //^ check existing user
  const existingUser = await getUserByEmail(email);

  //^ check user is exist only from credentials
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }
  //^ Handle unverified users
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken?.email!, verificationToken?.token!);

    return { success: "Confirmation email sent!" };
  }
  //^ Handle two-factor authentication
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      //^ Code provided by user
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }
      const hasExpired = new Date(twoFactorToken.expires!) < new Date();
      if (hasExpired) {
        return { error: "Code expired!" };
      }

      //^ Code is valid, delete used token and confirmation record (if exists)
      await db.delete(TwoFactorTokenSchema).where(eq(TwoFactorTokenSchema.id, twoFactorToken.id));
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.delete(twoFactorConfirmation).where(eq(twoFactorConfirmation.id, existingConfirmation.id));
      }
      await db.insert(twoFactorConfirmation).values({
        id: uuid(),
        userId: existingUser.id,
      });
    } else {
      //^ No code provided, send new token
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)!;
      await sendTwoFactorTokenEmail(twoFactorToken?.email!, twoFactorToken?.token!);
      return { twoFactor: true };
    }
  }
  //^ Sign in and handle errors
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials !" };

        default:
          return { error: "Something went wrong !" };
      }
    }
    throw error; //^ Re-throw non-AuthError exceptions
  }
};
