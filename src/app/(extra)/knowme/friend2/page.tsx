"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { getAnswersByQuizId } from "@/data/knowme";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Check, X ,ChevronsUpDown, Trophy} from "lucide-react";
import { Input } from "@/components/ui/input";
import Loading from "./loading";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { questionsData as baseQuestionsData } from "../_componnets/questiondata";
import { saveFriendTwoAnswers } from "@/actions/knowme";

type Props = {};

export default function Page({}: Props) {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const [friendOneAnswers, setFriendOneAnswers] = useState<string[]>([]);
  const [currentQue, setCurrentQue] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [friendOneName, setFriendOneName] = useState<string | null>(null);
  const [isNameEntered, setIsNameEntered] = useState<boolean>(false);
  const [friendTwoName, setFriendTwoName] = useState<string>("");
  const [friendTwoScore, setFriendTwoScore] = useState<number>(0);
  const [pronoun, setPronoun] = useState<{ heShe: string; hisHer: string }>({ heShe: "", hisHer: "" });

  useEffect(() => {
    const fetchAnswers = async () => {
      if (quizId) {
        const data: any = await getAnswersByQuizId(quizId as string);
        setFriendOneAnswers(data.answers);
        setFriendOneName(data.name);
        setPronoun(data.gender === "MALE" ? { heShe: "he", hisHer: "his" } : { heShe: "she", hisHer: "her" });
        
        // Check if the user has already taken the quiz
        const localData = localStorage.getItem(quizId as string);
        if (localData) {
          const parsedData = JSON.parse(localData);
          if (parsedData.uuid && parsedData.score !== undefined && parsedData.name) {
            setFriendTwoName(parsedData.name);
            setFriendTwoScore(parsedData.score);
            setAnswers(parsedData.answers);
            setIsNameEntered(true);
            setShowResult(true);
            
          }
          else {
            setIsNameEntered(false); // Set isNameEntered to false to ask for the name
          }
        } else {
          setIsNameEntered(false); // Set isNameEntered to false to ask for the name
        }
      }
    };

    fetchAnswers();
  }, [quizId]);


  const personalizeQuestion = (question: string, name: string, pronoun: { heShe: string; hisHer: string }) => {
    return question
      .replace(/\byour\b/g, `${pronoun.hisHer}`)
      .replace(/\bare\b/g, "is")
      .replace(/\byou\b/g, pronoun.heShe)
      .replace(/\bYou\b/g, pronoun.heShe.charAt(0).toUpperCase() + pronoun.heShe.slice(1))
      .replace(/\byours\b/g, `${pronoun.hisHer}`);
  };

  const getUpdatedQuestions = (name: string) => {
    return baseQuestionsData.map(question => ({
      ...question,
      question: personalizeQuestion(question.question, name, pronoun),
    }));
  };

  const questionsData = friendOneName ? getUpdatedQuestions(friendOneName) : baseQuestionsData;

  type FormData = {
    answer: string;
  };

  const questionSchema = z.object({
    answer: z.string().min(1, "You must select an option"),
  });

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      answer: undefined,
    },
  });

  const onSubmit = async(data: FormData) => {
    setAnswers([...answers, data.answer]);
    if (currentQue < questionsData.length - 1) {
      setCurrentQue(currentQue + 1);
    } else {
      const score = [...answers,data.answer].reduce((acc, answer, index) => {
        return acc + (answer === friendOneAnswers[index] ? 1 : 0);
      }, 0);
      setFriendTwoScore(score);
      setShowResult(true);
      // Save the score and UUID in local storage
      const userUuid = uuid();
      localStorage.setItem(quizId as string, JSON.stringify({ uuid: userUuid, score, name: friendTwoName,answers:[...answers,data.answer] }));

      await saveFriendTwoAnswers(friendTwoName,score,quizId!);
      
    }
    form.reset();
  };

  const percentage = (friendTwoScore / questionsData.length)*100;
  const nameSchema = z.object({
    name: z.string().min(1, "You must enter a name"),
  });

  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmitNameFriendTwo = (data: { name: string }) => {
    setFriendTwoName(data.name);
    setIsNameEntered(true);
  };
  console.log(questionsData, "ques");
  return (
    <div className="h-full overflow-auto font-mono">
      <div className="max-w-3xl  justify-between  mx-auto p-5">
        {friendOneName && questionsData.length > 0 ? (
          <>
            {isNameEntered ? (
              <div className="space-y-3">
                {!showResult ? (
                  <div className="w-full px-5 pt-5 md:pt-10">
                    <div className="flex flex-col flex-wrap md:flex-row -mt-5 -mx-2.5 *:mt-5 *:px-2.5 ">
                      <div className="md:w-1/2">
                        <div className="flex flex-col">
                          <div className="text-slate-700  mt-5 bg-white mb-5 font-semibold text-2xl md:w-full">
                            {friendOneName ? (
                              <span>
                                Guess About <span className="text-blue-500 font-bold capitalize">{friendOneName.toLowerCase()}</span>
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="text-gray-500 text-sm mb-2">
                            Question {currentQue + 1} of {questionsData.length}
                          </div>
                          <div className="font-bold">{questionsData[currentQue]?.question}</div>
                          <Progress className="h-3 mt-3 md:mt-10 rounded-full bg-indigo-200" value={((currentQue + 1) / questionsData.length) * 100} />
                        </div>
                      </div>
                      <div className="bg-white md:w-1/2">
                        <div className="w-full">
                          <Form {...form}>
                            <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                              <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormControl>
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {questionsData[currentQue].options.map((option, index) => (
                                          <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <div className="w-full">
                                                <RadioGroupItem id={option} value={option} className="peer sr-only" />
                                                <Label htmlFor={option} className="flex flex-col w-full items-center justify-between rounded-md border-2 border-gray-300  p-3.5 hover:bg-slate-100 peer-data-[state=checked]:bg-slate-100 peer-data-[state=checked]:border-slate-800 [&:has([data-state=checked])]:border-slate-800">
                                                  {option}
                                                </Label>
                                              </div>
                                            </FormControl>
                                          </FormItem>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            { form.getValues('answer') &&
                                <Button type="submit"  className="mt-5 w-full" disabled={form.formState.isSubmitting}>
                                {currentQue < questionsData.length - 1 ? "Next question" : "Submit answers"}
                              </Button>
                            }
                            </form>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="max-w-sm mx-auto p-4">
                      <div
                        className={cn("mb-4 space-y-3 flex flex-col items-center shadow-md rounded-md p-5", {
                          "text-green-600": percentage > 80,
                          "text-yellow-600": percentage > 50 && percentage <= 80,
                          "text-orange-600": percentage > 30 && percentage <= 50,
                          "text-red-600": percentage <= 30,
                        })}
                      >
                        <Trophy className="size-16" />
                        <span className="flex flex-col items-center">
                          <span className="text-sm font-semibold">Your Score </span>
                          <span className="font-bold text-xl">
                            {friendTwoScore} / {questionsData.length}
                          </span>
                          <span className="text-pretty text-center">
                            {friendTwoName} understands their friend {friendOneName} <span className="font-semibold">{percentage}%</span>
                          </span>
                        </span>
                      </div>
                      <Collapsible className="group">
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" className="w-full" size="sm">
                            Click to see the result
                            <ChevronsUpDown className="ms-auto size-4" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="mt-5">
                            {questionsData.map((q, index) => (
                              <div key={uuid()} className="mb-10">
                                <h3 className="font-bold text-xl mb-2">
                                  {index + 1}.{q.question}
                                </h3>
                                <RadioGroup value={answers[index]}>
                                  {q.options.map((option, i) => {
                                    const isCorrect = option === friendOneAnswers[index];
                                    const isSelected = option === answers[index];
                                 
                                    return (
                                      <div key={uuid()} className={cn("rounded-md text-xs p-1 flex border-2 border-gray-300  justify-center gap-2 ", isCorrect ? "bg-green-600 border-green-600 text-white" : isSelected ? "bg-red-600 border-red-600 text-white" : "")}>
                                        {isCorrect ? <Check className="size-4" /> : isSelected ? <X className="size-4" /> : null}
                                        {option}
                                      </div>
                                    );
                                  })}
                                </RadioGroup>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full max-w-sm mx-auto">
                <Form {...nameForm}>
                  <form className="space-y-4 md:space-y-6" onSubmit={nameForm.handleSubmit(onSubmitNameFriendTwo)}>
                    <FormField
                      control={nameForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel showError={false}>Your name</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" placeholder="Enter your name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-5">
                      Start Quiz
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </>
        ) : (
          <Loading className="mx-auto" />
        )}
      </div>
    </div>
  );
}
