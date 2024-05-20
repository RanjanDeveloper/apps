import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import EditUserDialogue from "./edit-user-dialogue";
import { SquarePenIcon, Trash2 } from "lucide-react";
import DeleteUserDialogue from "./delete-user-dialogue";
type Props<TData> = {
  row: Row<TData>;
};

export default function MoreActions<TData>({ row }: Props<TData>) {
  const user:any = row.original;
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleEditUser = () => {
    setOpenEdit(true);
  };
  const handleDeleteUser = () => {
    setOpenDelete(true);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <FiMoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <div className="flex items-center font-semibold w-full grow cursor-pointer" onClick={handleEditUser}>
              <SquarePenIcon className="size-4 mr-2" />
              Edit
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex items-center font-semibold w-full grow cursor-pointer" onClick={handleDeleteUser}>
              <Trash2 className="size-4 mr-2" />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openEdit && <EditUserDialogue isOpen={openEdit}  onEditUserOpenChanges={setOpenEdit} user={user} />}
      {openDelete && <DeleteUserDialogue isOpen={openDelete} onDeleteUserOpenChanges={setOpenDelete} user={user} />}
    </>
  );
}
