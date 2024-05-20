"use client";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { logOut } from "@/actions/logout";
import { RxExit } from "react-icons/rx"

type Props = {};

export default function UserButton({}: Props) {
  const user = useCurrentUser();

  const logoutHandler = () => {
    logOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-slate-900">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align='end'>
        <DropdownMenuItem>
          <div className="cursor-pointer flex flex-1 items-center" onClick={logoutHandler}><RxExit className="w-4 h-4 mr-2"/>Logout</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
