"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flameschema, LoginSchema } from "@/schemas";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { calculateFlames } from "@/actions/flames";
import Image from "next/image";
import FriendsImage from "@public/friends.svg";
import LoversImage from "@public/lovers.svg";
import AffectionImage from "@public/affection.svg";
import MarriageImage from "@public/marriage.svg";
import EnemiesImage from "@public/enemies.svg";
import SiblingsImage from "@public/siblings.svg";
import { Progress } from "@/components/ui/progress";
type Props = {};

const flamesImages: Record<string, string> = {
  Friends: FriendsImage,
  Lovers: LoversImage,
  Affection: AffectionImage,
  Marriage: MarriageImage,
  Enemies: EnemiesImage,
  Siblings: SiblingsImage,
};

export default function LoginForm({}: Props) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ relation: string; percentage: string } | null>(null);

  const form = useForm<z.infer<typeof Flameschema>>({
    resolver: zodResolver(Flameschema),
    defaultValues: {
      name1: "",
      name2: "",
    },
  });

  // Function to handle form submission
  const submitHandler = async (values: z.infer<typeof Flameschema>) => {
    startTransition(() => {
      calculateFlames(values.name1.toLowerCase().replace(/\s/g, ""), values.name2.toLowerCase().replace(/\s/g, "")).then(data => setResult(data));
    });
  };
  const backHandler = () => {
    setResult(null);
    form.reset();
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {!result && (
              <>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">FLAMES</h1>
                <Form {...form}>
                  <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
                    <FormField
                      control={form.control}
                      name="name1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel showError={false}>Your Name</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" placeholder="Romeo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel showError={false}>Partner Name</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" placeholder="Juliet" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button disabled={isPending} type="submit" className="w-full">
                      Calculate
                    </Button>
                  </form>
                </Form>
              </>
            )}
            {result && (
              <>
              <Image
                src={flamesImages[result.relation]}
                alt={result.relation}
                className="w-full max-w-40 mx-auto"
              />
              <div className="flex flex-col leading-5 items-center font-semibold space-y-2 text-2xl text-gray-800">
                <span className="capitalize">{form.getValues("name1").toLowerCase()}</span>
                <span className="text-sm text-gray-600">&</span>
                <span className="capitalize">{form.getValues("name2").toLowerCase()}</span>
              </div>
              <div className="text-center font-bold text-3xl text-indigo-600 mt-4">
                {result.relation}
              </div>
              <div className="text-center text-md text-gray-700 mt-2">
                Love Percentage: {result.percentage}%
              </div>
              <div className="w-3/4 mx-auto mt-4">
                <Progress value={Number(result.percentage)} className="h-4 rounded-full bg-indigo-200" />
              </div>
              <div className="text-center mt-6">
                <Button
                  size="sm"
                  variant="link"
                  className="text-blue-800 hover:text-blue-600"
                  onClick={backHandler}
                >
                  Back to Calculate
                </Button>
              </div>
            </>
            
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
