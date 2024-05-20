"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddPayerDialogue from "./add-payer-dialogue";
import { Plus } from "lucide-react";


type Props = {
  eventId:string
};

export default function AddPayer({eventId}: Props) {



  const [openAddPayer, setOpenAddPayer] = useState<boolean>(false);
  const handleAddPayer = () => {
    setOpenAddPayer(true);
  };

  return (
    <>
      <Button className="font-bold" onClick={handleAddPayer}>
        <Plus className="size-4 mr-2" />
        Add Payer
      </Button>
      {openAddPayer && <AddPayerDialogue eventId={eventId}  isOpen={openAddPayer} onAddUserOpenChanges={setOpenAddPayer} />}
    </>
  );
}
