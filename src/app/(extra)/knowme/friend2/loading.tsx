import { cn } from "@/lib/utils";
import { BarLoader } from "react-spinners";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  
};

export default function Loading({ className }:LoadingProps) {
  return (
    <div className={cn("h-full flex items-center justify-center", className)}>
      <BarLoader className="text-slate-900 min-w-52" />
    </div>
  );
}
