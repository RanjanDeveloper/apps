"use client";
import React, { startTransition, useState } from "react";
import { Row } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import EditPayersDialog from "./edit-payer-dialogue";
import { SquarePenIcon, Trash2 } from "lucide-react";
import { deletePayer } from "@/actions/payers";
import DeletePayersDialog from "./delete-payer-dialogue";

type Props<TData> = {
  row: Row<TData>;
};

export default function MoreActions<TData>({ row }: Props<TData>) {
  const payer: any = row.original;
  const [showDeletePayersDialog, setShowDeletePayersDialog] = useState(false);
  const [showEditPayersDialog, setShowEditPayersDialog] = useState(false);
  const handleEditPayer = () => {
    setShowEditPayersDialog(true);
  };
  const handleDeletePayer = () => {
    setShowDeletePayersDialog(true);
  };
  const handleDeleteSuccess = () =>{
    setShowDeletePayersDialog(false);
  }
  const handleEditSuccess = () =>{
    setShowEditPayersDialog(false);
  }
  return (
    <>
     {showDeletePayersDialog && <DeletePayersDialog open={showDeletePayersDialog}  onOpenChange={setShowDeletePayersDialog} payers={[payer]} onSuccess={handleDeleteSuccess} showTrigger={false} />} 
     {showEditPayersDialog && <EditPayersDialog open={showEditPayersDialog} onOpenChange={setShowEditPayersDialog} payer={payer} onSuccess={handleEditSuccess}/>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <FiMoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={handleEditPayer}>
            <div className="flex items-center font-semibold w-full grow cursor-pointer">
              <SquarePenIcon className="size-4 mr-2" />
              Edit
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDeletePayer}>
            <div className="flex items-center font-semibold w-full grow cursor-pointer" >
              <Trash2 className="size-4 mr-2" />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
