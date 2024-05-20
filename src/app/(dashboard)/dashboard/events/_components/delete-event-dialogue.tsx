import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Events } from "./columns";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEvent } from "@/actions/events";
type Props = {
  isOpen: boolean;
  onDeleteEventOpenChanges: React.Dispatch<React.SetStateAction<boolean>>;
  event: Events;
};

export default function DeletePayerDialogue({ isOpen, onDeleteEventOpenChanges, event }: Props) {
  const [isPending, startTransition] = useTransition();
  const handlePayerDelete = () => {
    startTransition(() => {
      const id: string = event.eventsData.id;
      deleteEvent(id)
        .then(data => {
          if (data?.error) {
            toast.error(data.error)
          }
          if (data?.success) {
            toast.success(data.success)
            onDeleteEventOpenChanges(false);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onDeleteEventOpenChanges}>
      <DialogContent onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={isPending} onClick={handlePayerDelete}>
          {isPending && <Loader2 className="size-4 mr-2 animate-spin"/>}Delete 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
