"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


type Props = {};

export default function Navbar({}: Props) {
  const pathname = usePathname();
  return (
    <div className="p-4 flex justify-between items-center w-full max-w-[600px] rounded-xl shadow-sm bg-white">
      <div className="flex space-x-2">
        <Button asChild variant={pathname === "/server" ? "default" : "outline"}>
          <Link href="/server">Server</Link>
        </Button>
        <Button asChild variant={pathname === "/client" ? "default" : "outline"}>
          <Link href="/client">Client</Link>
        </Button>
        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link href="/admin">Admin</Link>
        </Button>
        <Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      
    </div>
  );
}
