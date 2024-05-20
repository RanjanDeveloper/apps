"use client";
import { admin } from "@/actions/admin";
import Rolegate from "@/components/auth/role-gate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRoleEnum } from "@/db/schemas";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";

type Props = {};

const handleServerActionClick = ()=>{
    admin().then((data)=>{
      if(data.error){
        toast.error(data.error)
      }
      if(data.success){
        toast.success(data.success)
      }
    })
}
const handleApiRouteClick = () => {
  fetch("/api/admin").then(res => {
    if (res.ok) {
      toast.success("Allowed Api Route!");
    } else {
      toast.error('Forbidden Api Route!');
    }
  });
};
export default function AdminPage({}: Props) {


  return (
    <Card className="md:w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 ADMIN</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Rolegate allowedRole={UserRoleEnum.ADMIN}>
          <Alert variant="success">
            <FaCheck className="h-4 w-4" />
            <AlertDescription>You are allowed to see this content!</AlertDescription>
          </Alert>
        </Rolegate>
        <div className="flex justify-between items-center p-3 border rounded-lg shadow-md">
          <p className="text-sm font-medium">Admin-only Api Route</p>
          <Button onClick={handleApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex justify-between items-center p-3 border rounded-lg shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={handleServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
