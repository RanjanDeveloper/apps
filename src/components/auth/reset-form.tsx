"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { reset } from "@/actions/reset";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
type Props = {};

export default function ResetForm({}: Props) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  // Function to handle form submission
  const submitHandler = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      reset(values).then(data => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  const alertMessage = error || success;
  const alertVariant = success ? "success" : "destructive";
  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Reset Password</h1>
            <Form {...form}>
              <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel showError={false}>Your email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="name@gmail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {alertMessage && (
                  <Alert className="p-3" variant={alertVariant}>
                    {success && <FaCheck className="h-4 w-4" />}
                    {!success && error && <BsExclamationTriangle className="h-4 w-4" />}
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isPending} className="w-full">
                  Send Reset Email
                </Button>

                <Button asChild variant="link">
                  <Link href="/auth/register" className="!px-0 w-full">
                    Don't have an accout?
                  </Link>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
