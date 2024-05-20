"use client"

import { ColumnDef } from "@tanstack/react-table"
import MoreActions from "./more-actions";
import DataTableColumnHeader from "./data-table-column-header";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export type Users = {
  id: string
  name: string | null
  email: string
  isTwoFactorEnabled:boolean | null
}

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "name",
    header: ({column})=> {
      return(
       <DataTableColumnHeader column={column} title="Name"/>
      )
    } 
  },
  {
    accessorKey: "email",
    header: ({column})=> {
      return(
        <DataTableColumnHeader column={column} title="Email"/>
      )
    } 
  },
  {
    accessorKey: "isTwoFactorEnabled",
    header: ({column})=> {
      return(
        <DataTableColumnHeader column={column} title="isTwoFactorEnabled"/>
      )
    } 
  },
  {
    id:'actions',
    cell:({row}) => <MoreActions row={row}/>,
  
  }
]
