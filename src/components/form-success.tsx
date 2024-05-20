import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaCheck } from "react-icons/fa";

type Props = {
  message?: string;
};

export default function FormSuccess({ message }: Props) {
  if (!message) return null;
  return (
    <Alert className="p-3" variant="success">
      <FaCheck className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
