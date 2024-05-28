// app/flames-calculator.ts
"use server";
import { db } from "@/db";
import { flames } from "@/db/schemas";
export const calculateFlames = async (name1: string, name2: string) => {
  const flamess = ["Friends", "Lovers", "Affection", "Marriage", "Enemies", "Siblings"];
  let count = 0;

  const name1Arr = name1.toLowerCase().replace(/\s/g, "").split("");
  const name2Arr = name2.toLowerCase().replace(/\s/g, "").split("");
  // Calculate the number of uncommon characters
  name1Arr.forEach(char => {
    if (name2Arr.includes(char)) {
      name2Arr.splice(name2Arr.indexOf(char), 1);
    } else {
      count++;
    }
  });

  count += name2Arr.length;
  let index = 0;
  while (flamess.length > 1) {
    index = (index + count - 1) % flamess.length;
    flamess.splice(index, 1);
  }
   // Calculate the percentage (example logic, adjust as needed)
   const percentage = ((count / (name1.length + name2.length)) * 100).toFixed(2);
  await db.insert(flames).values({ name1, name2, relation: flamess[0],percentage }).returning();
  return { relation: flamess[0], percentage };
};


