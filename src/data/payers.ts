"use server";
import {  events, payers } from "@/db/schemas";
import { db } from "@/db";
import { v4 as uuid } from "uuid";
import { currentUser } from "@/lib/auth";
import { sql, eq, sum, and, ilike } from "drizzle-orm";

export const getPayersByEventId = async (eventId: string) => {
  try {
    const payers = await db.query.payers.findMany({
      where: (payers, { eq }) => eq(payers.eventId, eventId),
    });
    return payers;
  } catch {
    return null;
  }
};

export const insertPayer = async (name: string, amount: number, eventId: string,userId:string, city?: string, description?: string) => {
  try {
    const newPayer = {
      id: uuid(),
      name,
      eventId,
      userId,
      city,
      description,
      amount,
    };
    const insertedUser = await db.insert(payers).values(newPayer).returning();
    return insertedUser;
  } catch (error) {
    console.error("Error adding admin:", error);
  }
};
export const getCurrentUserPayers = async () => {
  try {
    const user = await currentUser()!;
    const payersData = await db
      .select({
        name: sql<string>`lower(${payers.name})`.as("name"),
        title: events.title,
        userId: events.userId,
        location: sql<string>`lower(${payers.city})`.as("location"),
        amount: sum(payers.amount).as("amount"),
      })
      .from(payers)
      .leftJoin(events, eq(payers.eventId, events.id))
      .groupBy(sql`lower(${payers.name})`, sql`lower(${payers.city})`, events.id)
      .as("payersData");
    const result = await db
      .select({
        name: sql<string>`lower(${payersData.name})`.as("name"),
        amount: sum(payersData.amount),
        location: sql<string>`lower(${payersData.location})`.as("location"),
        events: sql<string>`array_agg(${payersData.title})`.as("events"),
        id: sql<string>`concat(lower(${payersData.name})||'_'||lower(${payersData.location}))`,
      })
      .from(payersData)
      .groupBy(sql`lower(${payersData.name})`, sql`lower(${payersData.location})`)
      .where(eq(payersData.userId, user?.id as string));

    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPayerDetails = async (name: string, city?: string) => {
  try {
    const user = await currentUser()!;
    console.log("cities",name, city);
    const filter = city ? and(eq(sql`lower(${payers.name})`, name), eq(sql`lower(${payers.city})`, city)) : eq(sql`lower(${payers.name})`, name);
    const payersData = await db
      .select({
        name: sql<string>`lower(${payers.name})`.as("name"),
        city: sql<string>`lower(${payers.city})`.as("city"),
        eventId: payers.eventId,
        userId: events.userId,
        title: events.title,
        amount: sum(payers.amount).as("amount"),
        eventType: events.eventType,
      })
      .from(payers)
      .leftJoin(events, eq(payers.eventId, events.id))
      .where(filter)
      .groupBy(sql`lower(${payers.name})`, sql`lower(${payers.city})`, payers.eventId, events.title, events.eventType,events.id)
      .as('payersData');
      
    const result = await db
      .select({
        name: sql<string>`lower(${payersData.name})`,
        city: sql<string>`lower(${payersData.city})`,
        totalAmount: sum(payersData.amount),
        events: sql<string>`json_agg(json_build_object('title', ${payersData.title}, 'amount', ${payersData.amount},'eventType',${payersData.eventType}))`.as("events"),
      })
      .from(payersData)
      .groupBy(sql`lower(${payersData.name})`, sql`lower(${payersData.city})`).where(eq(payersData.userId, user?.id as string));
    console.log({ result });
    return result;
  } catch (error) {
    console.error("Error fetching payer details:", error);
    return null;
  }
};
export const getPayerDetailsByName = async (name: string) => {
  try {
    const user = await currentUser()!;
    const result = await db
      .select({
        name: sql<string>`lower(${payers.name})`.as("name"),
        city: sql<string>`lower(${payers.city})`.as("city"),
      })
      .from(payers).leftJoin(events,eq(events.id, payers.eventId))
      .where(and(ilike(payers.name, `${name}%`),eq(events.userId, user?.id as string)))
      .groupBy(sql`lower(${payers.name})`, sql`lower(${payers.city})`);
      
    console.log({ result });
    return result;
  } catch (error) {
    console.error("Error fetching payer details:", error);
    return null;
  }
};
export const getAllPayersCities = async (city: string) => {
  try {
    const result = await db
      .select({
        city: sql<string>`lower(${payers.city})`.as("city"),
      })
      .from(payers)
      .where(ilike(payers.city, `${city}%`))
      .groupBy(sql`lower(${payers.city})`);

    console.log({ result });
    return result;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return null;
  }
};
