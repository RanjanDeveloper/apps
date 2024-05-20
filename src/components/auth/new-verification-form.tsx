"use client";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback } from "react";
import { newVerification } from "@/actions/new-verification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";

type Props = {};

export default function NewVerificationForm({}: Props) {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token")!;

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    newVerification(token)
      .then(data => {
        console.log(data);
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const alertMessage = error || success;
  const alertVariant = success ? "success" : "destructive";
  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col items-center justify-center">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Confirming your verification</h1>
           
            <BeatLoader loading={!success && !error}/>
            {alertMessage && (
              <Alert className="p-3 w-auto" variant={alertVariant}>
                {success && <FaCheck className="h-4 w-4" />}
                {error && <BsExclamationTriangle className="h-4 w-4" />}
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}

            <Button asChild variant="link">
              <Link href="/auth/login" className="!px-0 w-full">Back to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
