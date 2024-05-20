"use server";

import { AddPayerSchema, EditPayerSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/db";
import { insertPayer } from "@/data/payers";
import { payers } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";

export const addPayer = async (values: z.infer<typeof AddPayerSchema>, eventId: string) => {
  noStore();
  const user =await currentUser();
  if(!user){
    return { error: "User not found!" };
  }
  const validateFields = AddPayerSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  const { name, city, amount, description } = validateFields.data;
  const addedPayer = await insertPayer(name, amount, eventId,user?.id!, city,description);
  if (!addedPayer) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('dashboard/events/[eventId]','page');
  return { success: "Payer added Successfully!" };
};

export const editPayer = async (values: z.infer<typeof EditPayerSchema>, id: string) => {
  noStore();
  const validateFields = EditPayerSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { name, city, amount,description } = validateFields.data;
  const updatedPayer = await db.update(payers).set({ name, city, amount,description }).where(eq(payers.id, id));
  if (!updatedPayer) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('dashboard/events/[eventId]','page');
  return { success: "Updated successfully!" };
};

export const deletePayer = async (id: string) => {
  noStore();
  const updatedPayer = await db.delete(payers).where(eq(payers.id, id));
  if (!updatedPayer) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('/');
  return { success: "Deleted successfully!" };
};
