"use client"

import { ColumnDef } from "@tanstack/react-table"
import MoreActions from "./more-actions";
import DataTableColumnHeader from "./data-table-column-header";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export type Payers = {
  id: string;
  name: string;
  city: string;
  amount:number;
  description:string;
}

export const columns: ColumnDef<Payers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value:any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value:any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({column})=> {
      return(
       <DataTableColumnHeader  column={column} title="Name"/>
      )
    } 
  },
  {
    accessorKey: "city",
    header: ({column})=> {
      return(
        <DataTableColumnHeader column={column} title="City"/>
      )
    } 
  },
  {
    accessorKey: "description",
    header: ({column})=> {
      return(
        <DataTableColumnHeader column={column} title="Extra"/>
      )
    },
    cell: ({ row }) => {
      return row.original.description;
    },
    accessorFn: d => String(d.description)

  },
  {
    accessorKey: "amount",
    header: ({column})=> {
      return(
        <DataTableColumnHeader column={column} title="Amount"/>
      )
    },
    cell: ({ row }) => {
      return formatCurrency(row.original.amount,'INR');
    },
    
  },
  {
    id:'actions',
    cell:({row}) => <MoreActions row={row}/>,
  
  }
]
