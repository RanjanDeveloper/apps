
"use server";
import { currentUser } from "@/lib/auth";
import { AddEventSchema,EditEventSchema } from "@/schemas";
import { insertEvent } from "@/data/events";
import * as z from "zod";
import { db } from "@/db";
import { getPayersByEventId } from "@/data/payers";
import { revalidatePath } from "next/cache";
import { events } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const addEvent = async (values: z.infer<typeof AddEventSchema>) => {
  const user = await currentUser();
  if(!user){
    return { error: "User not found!" };
  }
  const validateFields = AddEventSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { title: name, eventType, date, place } = validateFields.data;
  const addedEvent = await insertEvent(user?.id!, name, eventType!, date!, place!);
  if (!addedEvent) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('/dashboard/events');
  return { success: "Event added Successfully!" };
};
export const editEvent = async (values: z.infer<typeof EditEventSchema>, id: string) => {
  const validateFields = EditEventSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  const { title, eventType, date:dateTime, place:location } = validateFields.data;
  const updatedPayer = await db.update(events).set({ title, eventType, dateTime,location }).where(eq(events.id, id));
  if (!updatedPayer) {
    return { error: "Something went wrong!" };
  }
  revalidatePath(`/dashboard/events`)
  return {success:"Updated successfully!"}
};
export const deleteEvent = async (id: string) => {

  const deletedEvent = await db.delete(events).where(eq(events.id, id));
  if (!deletedEvent) {
    return { error: "Something went wrong!" };
  }
  revalidatePath('/dashboard/events')
  return {success:"Deleted successfully!"}
};
export const getCurrentEvent = async(eventId:string)=> {
  const user = await currentUser();
  if(!user){
    return {error:"User doesnt exist !"}
  }
  const event = await db.query.events.findFirst({
    where:(events,{eq})=> eq(events.id,eventId)
  })
  if(!event || event.userId !== user.id){
    return {error:"Event doesnt exist !"}
  }
   const payers = await getPayersByEventId(event.id);

  return payers
}


