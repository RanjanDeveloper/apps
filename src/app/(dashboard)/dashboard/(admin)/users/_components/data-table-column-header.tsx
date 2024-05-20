import React from 'react'
import { Column } from '@tanstack/react-table'
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ArrowUpDown,ArrowUp,ArrowDown,EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const handleSort = (column:any)=> {
  column.toggleSorting()
  }

interface DataTableColumnHeaderProps<TData,TValue>
 extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData,TValue>
  title:string
}

export default function DataTableColumnHeader<TData,TValue>({column,title,className}: DataTableColumnHeaderProps<TData,TValue>) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size='sm' className='-ml-3 h-8 data-[state=open]:bg-gray-100' onClick={() => handleSort(column)}>
            {title} <ArrowUpDown className="ml-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={()=> column.toggleSorting(false)}>
            <ArrowUp className='mr-2 size-3.5 text-gray-500'/>
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=> column.toggleSorting(true)}>
            <ArrowDown className='mr-2 size-3.5 text-gray-500'/>
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 size-3.5 text-gray-500" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}