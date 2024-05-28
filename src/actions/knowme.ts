"use server";

import { db } from "@/db";
import { v4 as uuid } from "uuid";
import { answers,friendAnswers,quizLinks } from "@/db/schemas";

export const saveAnswers = async (answerss: any,name:string,gender: "MALE" | "FEMALE") => {;
  // Save answers to the database
  const newAnswers = await db.insert(answers).values({
    name,
    gender,
    answers: JSON.stringify(answerss), // Assuming answers is stored as a JSON string
  }).returning();
  console.log(newAnswers[0].id,"new");
  const link = uuid();
  await db.insert(quizLinks).values({
    answerId: newAnswers[0].id,
    link,
  }).returning();

  return { link };
};

export const saveFriendTwoAnswers = async (name:string,score:any,quizzId:string) => {;
  // Save answers to the database
  const newAnswers = await db.insert(friendAnswers).values({
    name,
   score,
    quizzId
  }).returning();

 

  return { quizzId:newAnswers[0].quizzId };
};
