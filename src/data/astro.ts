'use server';
import { db } from "@/db";
import {  raasiDetails, raasiUser } from "@/db/schemas";
import { and, eq,sql } from "drizzle-orm";



  
  // Helper function to get raasi details by birth date and time
 export const getRaasiDetailsByDateAndTime = async (birth_date: string, birth_time: string) => {
    return await db
      .select()
      .from(raasiDetails)
      .where(and(eq(raasiDetails.birth_date, birth_date), eq(raasiDetails.birth_time, birth_time)))
      .limit(1);
  };
  export const getRaasiUsers = async (name:string,birth_date: string, birth_time: string,birth_place:string) => {
    return await db
      .select()
      .from(raasiUser)
      .where(and(eq(sql`lower(${raasiUser.name})`,name.toLowerCase()),eq(raasiUser.birth_date, birth_date),
       eq(raasiUser.birth_time, birth_time),eq(sql`lower(${raasiUser.birth_place})`,birth_place)))
      .limit(1);
  };

