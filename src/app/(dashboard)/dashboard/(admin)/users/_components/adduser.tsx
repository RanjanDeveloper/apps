"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddUserDialogue from "./add-user-dialogue";
import { Plus } from "lucide-react";

type Props = {};

export default function AddUser({}: Props) {
  const [openAddUser, setOpenAddUser] = useState<boolean>(false);
  const handleAddUser = () => {
    setOpenAddUser(true);
  };
  return (
    <>
      <Button className="font-bold" onClick={handleAddUser}>
        <Plus className="size-4 mr-2" />
        Add User
      </Button>
      {openAddUser && <AddUserDialogue isOpen={openAddUser} onAddUserOpenChanges={setOpenAddUser} />}
    </>
  );
}
