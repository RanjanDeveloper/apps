'use client';
import { useCurrentRole } from "@/app/hooks/use-current-role";
import { cn } from "@/lib/utils";
import { CalendarCheck,User,Settings, HandCoins } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { v4 as uuid } from "uuid";
type Props = {};
interface MenuItem {
  name: string;
  icon: React.ReactNode; // Represents any valid JSX element for the icon
  path: string;
  allowedRoles?:any
}
export default function Sidebar({}: Props) {
  const role = useCurrentRole();
  const pathname = usePathname();
  const menuList: MenuItem[] = [
    {
        name: "Users",
        icon: <User className="size-4" />,
        path: "/dashboard/users",
        allowedRoles: ["ADMIN"]
      },
      {
        name: "Settings",
        icon: <Settings className="size-4" />,
        path: "/dashboard/settings",
        allowedRoles: ["ADMIN","USER"]
      },
      {
        name: "Events",
        icon: <CalendarCheck className="size-4" />,
        path: "/dashboard/events",
        allowedRoles: ["ADMIN","USER"]
      },
      {
        name: "Payers",
        icon: <HandCoins className="size-4" />,
        path: "/dashboard/payers",
        allowedRoles: ["ADMIN","USER"]
      },
      
  ];
  return (
    <div className="lg:w-[300px] lg:sticky bg-white border-r py-4">
      <div className="px-3 py-2 space-y-1">
        {menuList.map(menuitem => (
            menuitem.allowedRoles.includes(role) &&
          
          <Link key={uuid()} className="block" href={menuitem.path}>
            <div className={cn("flex items-center font-medium hover:bg-slate-100 p-3 space-x-2 rounded-md",(pathname === menuitem.path || pathname.startsWith(menuitem.path + "/")) && "bg-slate-100")}>
              <span>{menuitem.icon}</span>
              <span>{menuitem.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
