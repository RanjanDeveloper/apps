"use server";
import bcrypt from "bcryptjs";
import { addUser, editUser, getUserByEmail, getUserById } from "@/data/users";

import { UserRoleEnum, user } from "@/db/schemas";
import { currentRole } from "@/lib/auth";
import { AddUserSchema, EditUserSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export const admin = async () => {
  const role = await currentRole();
  if (role === UserRoleEnum.ADMIN) {
    return { success: "Allowed!" };
  }
  return { error: "Forbidden!" };
};

export const adduser = async (values: z.infer<typeof AddUserSchema>) => {
  const validateFields = AddUserSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  const { name, email, password,role, isTwoFactorEnabled } = validateFields.data!;

  const existingUser = await getUserByEmail(email);
  //^ check user is exist only from credentials
  if (existingUser && values.email === existingUser.email) {
    return { error: "Email already exist" };
  }
  const emailVerified = new Date();
  const addedUser = await addUser(name, email, password,role, isTwoFactorEnabled, emailVerified);
  if (!addedUser) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('/dashboard/users')
  return { success: "User added Successfully!" };
};
export const deleteUser = async (id: string) => {
  const deletedUser = await db.delete(user).where(eq(user.id, id));
  if (!deletedUser) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('/dashboard/users')
  return {success:"Deleted successfully!"}
};
export const edituser = async (values: z.infer<typeof EditUserSchema>, id: string) => {
  const validateFields = EditUserSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  const currentUser = await getUserById(id);
  if (!currentUser) {
    return { error: "User not found!" };
  }

  // Updated user existence check considering both email and ID
  const updatedEmail = values.email && values.email !== currentUser.email;
  if (updatedEmail) {
    const existingUser = await getUserByEmail(values.email!);
    if (existingUser && existingUser.id !== currentUser.id) {
      return { error: "Email already exists for another user!" };
    }
  }

  const updatedValues = { ...values };
  if (values.password) {
    updatedValues.password = await bcrypt.hash(values.password, 12);
  }
  const { name, email, password, isTwoFactorEnabled } = updatedValues;

  const updateUser = await editUser(id, name!, email!, password!, isTwoFactorEnabled!);
  if (!updateUser) {
    return { error: "Something went wrong!" };
  }
  revalidatePath("/dashboard/users");
  return { success: "User Updated Successfully!" };
};
