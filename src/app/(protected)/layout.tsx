import React from "react";
import Navbar from "./_components/navbar";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  return (
    <div className="h-full w-full flex flex-col items-center ">
       <div className="py-10 space-y-10">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
