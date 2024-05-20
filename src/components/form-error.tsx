import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { HtmlProps } from "next/dist/shared/lib/html-context.shared-runtime";
import { BsExclamationTriangle } from "react-icons/bs";

type Props =  {
  message?: string;
  className?:string;

};

export default function FormError({ message,className }: Props) {
  if (!message) return null;
  return (
    <Alert className={cn("p-3" ,className)} variant="destructive">
      <BsExclamationTriangle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
