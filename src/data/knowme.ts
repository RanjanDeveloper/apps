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

  return {
    answers: JSON.parse(answersString),
    name: quizLink[0].answers?.name || "",
    gender:quizLink[0].answers?.gender
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