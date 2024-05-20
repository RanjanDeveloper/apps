"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "./data-table-column-header";
import { EventsEnum } from "@/db/schemas";
import { format } from "date-fns";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export type Payers = {
  id: string;
  name: string;
  location: string;
  events: [];
  amount:number;
};

export const columns: ColumnDef<Payers>[] = [
  {
  
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      debugger;
      const name: any = row.original.name;
      const city = row.original.location;
      return (
        <Link  href={{
          pathname: `/dashboard/payers/payerDetails`,
          query: { name,city},
        }} >
        <span className="text-blue-500">{name}</span>
        </Link>
      );
    },
  },
  {
    
    accessorKey: "events",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Events" />;
    },
    cell:({row})=>{
      return row.original.events.length
    },
    accessorFn : d => Number(d.events.length)
  },
 
  {
    accessorKey: "location",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Location" />;
    },
  },
  {
    id:"amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
    cell:({row}) => {
      return formatCurrency(row.original.amount ?? 0,'INR');
    },
    accessorFn: d => Number(d.amount)
  },
  

 
];
