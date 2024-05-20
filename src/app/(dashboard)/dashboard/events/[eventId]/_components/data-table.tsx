"use client";

import {
   ColumnDef,
   flexRender,
   useReactTable, 
   ColumnFiltersState,
   SortingState, 
   getFilteredRowModel, 
   getCoreRowModel,
   getPaginationRowModel, 
   getSortedRowModel } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { startTransition, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./data-table-pagination";
import { Trash2 } from "lucide-react";
import { deletePayer } from "@/actions/payers";
import { toast } from "sonner";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isPending,startTransition] = useTransition();
  const table = useReactTable({
    data,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination:{
        pageSize:5,
        pageIndex:0,
      }
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
     
    },
  });
  const handleDeletePayer = () => {
    const payers:any = table.getFilteredSelectedRowModel().rows;
    toast.promise(
      Promise.all(
        payers.map(async (payer:any)=>{
          const id: string = payer.original.id;
          await deletePayer(id);
        }
          
        )
      ),
      {
        loading: "Deleting...",
        success: () => {
          return "Tasks deleted"
        },
        error: () => {
          return "something went wrong"
        },
      }
    )
  };
  return (
    <>
      <Input value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)} className="p-2 font-lg shadow border w-1/4" placeholder="Filter name..." />
     {
      table.getFilteredSelectedRowModel().rows.length > 0 && <div className="flex items-center font-semibold w-full grow cursor-pointer" onClick={handleDeletePayer}>
      <Trash2 className="size-4 mr-2" />
      Delete
    </div>
     } 
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell className="py-2" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}
