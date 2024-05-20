"use server";
import { EventsEnum, events, payers } from "@/db/schemas";
import { db } from "@/db";
import { v4 as uuid } from "uuid";
import { currentUser } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import {  unstable_noStore as noStore } from "next/cache";

export const getCurrentUserEvents = async () => {
  noStore();
  try {
    const user = await currentUser()!;
    const eventsData = await db
    .select({
      eventsData:events,
      payersCount: sql<number>`count(${payers.id})`.mapWith(Number),
      amount: sql<number>`sum(${payers.amount})`.mapWith(Number),
    })
    .from(events)
    .where(eq(events?.userId,user?.id as string))
    .leftJoin(payers, eq(payers.eventId, events.id))
    .groupBy(sql`${events.id}`);
       
    return eventsData;
  } catch {
    return null;
  }
};
export const insertEvent = async (id: string, name: string, eventType: EventsEnum, date: Date, place: string) => {
  try {
    console.log("triggered")
    const newEvent = {
      id: uuid(),
      userId: id,
      title: name,
      eventType,
      dateTime: new Date(),
      location: place,
    };
    console.log({newEvent})
    const event = await db.insert(events).values(newEvent).returning();
    return event;
  } catch(error) {
    console.error(error);
    return null;
  }
};
