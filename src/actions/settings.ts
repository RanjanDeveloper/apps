"use server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import * as z from "zod";
import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "@/data/users";
import { SettingsSchema } from "@/schemas";
import { UserRoleEnum, user as users } from "@/db/schemas"
import { eq } from "drizzle-orm";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { unstable_update } from "@root/auth";
import { revalidatePath } from "next/cache";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized!" };
  }
  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unauthorized!" };
  }
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(verificationToken?.email!, verificationToken?.token!);

    return { success: "verification email sent!" };
  }
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  const { name, role, isTwoFactorEnabled, email, password } = values;
  const updatedValues = {
    name,
    isTwoFactorEnabled,
    email,
    password,
    userRole: role,
  };
  await db.update(users).set(updatedValues).where(eq(users.id, dbUser.id!));
  const updatedUser = await db.query.user.findFirst({
    where: (user,{eq})=> eq(user.id,dbUser.id)
  })
  unstable_update({
    user: {
      name: updatedUser?.name,
      email: updatedUser?.email,
      isTwoFactorEnabled: updatedUser?.isTwoFactorEnabled ,
      role: updatedUser?.userRole as UserRoleEnum,
    }
  });
  revalidatePath('/');
  return { success: "Settings updated!" };
};
