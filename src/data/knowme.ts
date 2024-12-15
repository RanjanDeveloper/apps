"use server";

import { db } from "@/db";
import { quizLinks, answers, friendAnswers } from "@/db/schemas";
import { eq } from "drizzle-orm";

export const getAnswersByQuizId = async (quizId: string) => {
  const quizLink = await db
    .select()
    .from(quizLinks)
    .leftJoin(answers, eq(quizLinks.answerId, answers.id))
    .where(eq(quizLinks.link, quizId));

  if (!quizLink || quizLink.length === 0) {
    throw new Error("Not Found");
  }

  const answersString = quizLink[0].answers?.answers as string | undefined;
  const nameString = quizLink[0].answers?.name as string | undefined;

  if (!answersString) {
    throw new Error("Answers not found");
  }
  let parsedAnswers;
  try {
    parsedAnswers = typeof answersString === 'string' && answersString.startsWith('{') 
      ? JSON.parse(answersString) 
      : answersString;
  } catch (error) {
    console.error("Failed to parse answersString", answersString);
    throw new Error("Invalid answers format");
  }

  return {
    answers: parsedAnswers,
    name: nameString || "",
    gender: quizLink[0].answers?.gender
  };
};
export const getFriendsAnswersByQuizId = async (quizId: string) => {
  const quizLink = await db
    .select()
    .from(friendAnswers)
    .where(eq(friendAnswers.quizzId, quizId));

  if (!quizLink || quizLink.length === 0) {
    throw new Error("Not Found");
  }

 
  return quizLink
}