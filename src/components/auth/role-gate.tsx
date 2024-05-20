"use client";
import React from "react";
import { useCurrentRole } from "@/app/hooks/use-current-role";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BsExclamationTriangle } from "react-icons/bs";
import { UserRoleEnum } from "@/db/schemas";
type Props = {
  children: React.ReactNode,
allowedRole: UserRoleEnum
}
export default function Rolegate({ children, allowedRole }: Props) {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return (
      <Alert className="p-3" variant="destructive">
        <BsExclamationTriangle className="h-4 w-4" />
        <AlertDescription>you dont to have permission to view this content!</AlertDescription>
      </Alert>
    );
  }
  return (
    <>
    {children}
    </>
  );
}
