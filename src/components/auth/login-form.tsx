"use client";
import React, { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/login";
import { LoginSchema } from "@/schemas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Social from "@/components/auth/social";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


type Props = {};

export default function LoginForm({}: Props) {
  const [showTwofactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to handle form submission
  const submitHandler = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values,callbackUrl)
        .then(data => {
          if (data?.error) {
            if(!showTwofactor){
                form.reset();
            }
            toast.error(data.error);
           
          }
          if (data?.success) {
             if(!showTwofactor){
                form.reset();
             }
             toast.success(data.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(data.twoFactor);
          }
        })
        .catch(() =>  toast.error("something went wrong !"));
    });
  };

  const alertMessage = error || urlError || success;
  const alertVariant = success ? "success" : "destructive";

  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Login</h1>
            <Form {...form}>
              <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
                {!showTwofactor && (
                  <>
                  
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
                  </>
                )}
                {showTwofactor && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel showError={false}>Two factor code</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" placeholder="123456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button asChild variant="link">
                  <Link className="!px-0" href="/auth/reset">
                    Forgot password?
                  </Link>
                </Button>
                {alertMessage && (
                  <Alert className="p-3" variant={alertVariant}>
                    {success && <FaCheck className="h-4 w-4" />}
                    {((!success && error) || urlError) && <BsExclamationTriangle className="h-4 w-4" />}
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </Alert>
                )}

                <Button  type="submit" disabled={isPending} className="w-full">
                  {showTwofactor ? "Confirm" : "Login"}
                </Button>

                <Social />
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
