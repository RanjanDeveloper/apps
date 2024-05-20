"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/schemas";
import { register as signup } from "@/actions/register";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import Link from "next/link";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {};

export default function RegisterForm({}: Props) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  // Function to handle form submission
  const submitHandler = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      signup(values).then(data => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
           toast.success(data.success);
        }
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
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Register</h1>
            <Form {...form}>
              <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel showError={false}>Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="Enter your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <Button disabled={isPending} type="submit" className="w-full">
                  Create an account
                </Button>
                <Button asChild variant="link">
                  <Link href="/auth/login" className="!px-0 w-full">
                    Already have an accout?
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
