"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddEventDialogue from "./add-event-dialogue";
import { Plus } from "lucide-react";

type Props = {};

export default function AddEvent({}: Props) {
  const [openAddEvent, setOpenAddEvent] = useState<boolean>(false);
  const handleAddEvent = () => {
    setOpenAddEvent(true);
  };

  return (
    <>
      <Button className="font-bold" onClick={handleAddEvent}>
        <Plus className="size-4 mr-2" />
        Add Event
      </Button>
      {openAddEvent && <AddEventDialogue  isOpen={openAddEvent} onAddEventOpenChanges={setOpenAddEvent} />}
    </>
  );
}
