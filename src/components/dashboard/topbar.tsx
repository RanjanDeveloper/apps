import React from "react";
import UserButton from "@/components/dashboard/user-button";
import Image from "next/image";
import logo from '@public/logo.png'
type Props = {};

export default function Topbar({}: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 border-b bg-white z-20">
      <div className="h-14 flex items-center justify-between px-4">
       <Image className="size-8 ms-2" src={logo} alt="logo"/>
       <UserButton />
      </div>
    </div>
  );
}
