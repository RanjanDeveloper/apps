"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Social from "@/components/auth/social";
import { useSearchParams } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { newPassword } from "@/actions/new-password";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
type Props = {};

export default function NewPasswordForm({}: Props) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  // Function to handle form submission
  const submitHandler = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values, token).then(data => {
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
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">New Password</h1>
            <Form {...form}>
              <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel showError={false}>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="••••••••" />
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
                  Reset password
                </Button>

                <Social />
                <Button asChild variant="link">
                  <Link href="/auth/login" className="!px-0 w-full">
                    Back to Login
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
