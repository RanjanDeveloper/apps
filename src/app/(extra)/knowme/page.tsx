"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { saveAnswers } from "@/actions/knowme";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { questionsData } from "./_componnets/questiondata";
import { getFriendsAnswersByQuizId } from "@/data/knowme";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Loading from "@/app/loading";
import { RefreshCcw } from "lucide-react";
type Props = {};

export default function page({}: Props) {
  const [currentQue, setCurrentQue] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isNameEntered, setIsNameEntered] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [gender, setGender] = useState("MALE");
  const [quizzId, setQuizzId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [friendAnswers, setFriendAnswers] = useState<any>([]); // Define YourAnswerType according to your data structure
  const [showRestartWarning, setShowRestartWarning] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has already entered their name and answers
    const generatedLink = localStorage.getItem("generatedLink");
    const answers = localStorage.getItem("answers");
    const storedname = localStorage.getItem("name");
    const storedQuizzId = localStorage.getItem("quizzId");
    if (generatedLink && answers) {
      setIsNameEntered(true);
      setGeneratedLink(generatedLink);
      setAnswers(JSON.parse(answers));
      setUserName(storedname);
      setQuizzId(storedQuizzId);
    }
    debugger;
    // Fetch friend's answers by quiz ID
    if (storedQuizzId) {
      startTransition(() => {
        fetchFriendAnswers(storedQuizzId);
      });
    }
  }, []);
  const fetchFriendAnswers = (quizId: string) => {
    startTransition(() => {
      getFriendsAnswersByQuizId(quizId)
        .then(data => {
          setFriendAnswers(data);
        })
        .catch(error => {
          console.error("Error fetching friend's answers:", error);
        });
    });
  };
  const handleRefresh = () => {
    if (quizzId) {
      fetchFriendAnswers(quizzId);
    }
  };
  type FormData = {
    answer: string;
  };
  // Define the schema using Zod
  const questionSchema = z.object({
    answer: z.string().min(1, "You must select an option"),
  });
  const detailsSchema = z.object({
    questionnaireName: z.string().min(1, "You must enter a name"),
    gender: z.enum(["MALE", "FEMALE"]),
  });

  const nameForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      questionnaireName: "",
      gender: "MALE",
    },
  });
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      answer: undefined,
    },
  });

  const onSubmitName = (data: { questionnaireName: string; gender: "MALE" | "FEMALE" }) => {
    setIsNameEntered(true);
    setUserName(data.questionnaireName);
    setGender(data.gender);
    localStorage.setItem("name", data.questionnaireName);
    localStorage.setItem("gender", data.gender);
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    let name = nameForm.getValues("questionnaireName");
    let gender = nameForm.getValues("gender");
    setAnswers([...answers, data.answer]);
    // Process the answer here
    if (currentQue < questionsData.length - 1) {
      setCurrentQue(currentQue + 1);
    } else {
      const result = await saveAnswers([...answers, data.answer], name, gender);
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/knowme/friend2?quizId=${result.link}`;

      setGeneratedLink(link);
      setQuizzId(result.link);
      localStorage.setItem("quizzId", result.link);
      localStorage.setItem("generatedLink", link);
      // All questions answered
      console.log("Quiz completed");
    }
    localStorage.setItem("answers", JSON.stringify([...answers, data.answer]));
    form.reset(); // Reset form for the next question
  };
  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the button after 2 seconds
    }
  };
  const handleRestart = () => {
    localStorage.clear();
    setIsNameEntered(false);
    setGeneratedLink(null);
    setAnswers([]);
    setCurrentQue(0);
    setUserName(null);
    setGender("MALE");
    setQuizzId(null);
    setFriendAnswers([]);
    setShowRestartWarning(false);
  };
  if (isPending) return <Loading />;
  return (
    <div className="max-w-3xl justify-between flex flex-col md:flex-row mx-auto pt-10 font-mono">
      {isNameEntered ? (
        generatedLink ? (
          <div className="mt-5 mx-auto">
            <p className="font-bold text-xl">Hi, {userName} !</p>
            <div className="text-gray-700 mb-2">Send this link to your friend:</div>
            <div className="flex items-center space-x-2">
              <input type="text" readOnly value={generatedLink} className="w-full p-2 border border-gray-300 rounded" />
              <Button onClick={copyToClipboard} className={cn("min-w-24", isCopied ? "bg-slate-200 hover:bg-slate-200 text-slate-700" : "")}>
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>

            <div className="border mt-5 rounded-md shadow">
              <p className="font-2xl  flex justify-between rounded-t-md items-center font-bold p-3 bg-slate-900 text-white">Your friends answers <RefreshCcw role="button" onClick={handleRefresh} className="size-4"/></p>
              {friendAnswers.length > 0 ? (
                <>
                  {friendAnswers.map((friends: any, index: number) => (
                    <div key={friends.id} className="space-y-3 px-4 py-2">
                      <div className="flex space-x-1">
                        <span>{index + 1}.</span>
                        <div className="flex space-x-4 font-semibold">
                          <span className="capitalize">{friends.name.toLowerCase()}</span>
                          <span
                            className={cn({
                              "text-green-600": friends.score > 8,
                              "text-yellow-600": friends.score > 5 && friends.score <= 8,
                              "text-orange-600": friends.score > 3 && friends.score <= 5,
                              "text-red-600": friends.score <= 3,
                            })}
                          >
                            {friends.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4">No answers found</div>
              )}
            </div>
            <Button className="mt-10 w-full" onClick={() => setShowRestartWarning(true)} size='sm' variant="destructive" >
              Restart Quiz
            </Button>
          </div>
        ) : (
          <>
            <div className="md:w-1/2">
              <div className="p-5 flex flex-col">
                <div className="text-gray-500 text-sm mb-2">
                  Question {currentQue + 1} of {questionsData.length}
                </div>
                <div className="font-bold">{questionsData[currentQue]?.question}</div>
                <Progress className="h-3 mt-3 md:mt-10 rounded-full bg-indigo-200" value={((currentQue + 1) / questionsData.length) * 100} />
              </div>
            </div>
            <div className="bg-white md:w-1/2">
              <div className="p-5 w-full">
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
                    <Button type="submit" className="mt-5" disabled={form.formState.isSubmitting}>
                      {currentQue < questionsData.length - 1 ? "Next question" : "Submit answers"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="w-full max-w-sm mx-auto">
          <Form {...nameForm}>
            <form className="space-y-4 md:space-y-6" onSubmit={nameForm.handleSubmit(onSubmitName)}>
              <FormField
                control={nameForm.control}
                name="questionnaireName"
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
              <FormField
                control={nameForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">MALE</SelectItem>
                        <SelectItem value="FEMALE">FEMALE</SelectItem>
                      </SelectContent>
                    </Select>
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
      <AlertDialog open={showRestartWarning} onOpenChange={setShowRestartWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>If you restart the quiz, your current question answers will reset and your friend's answers for these questions will not show. Are you sure you want to restart?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestart}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
