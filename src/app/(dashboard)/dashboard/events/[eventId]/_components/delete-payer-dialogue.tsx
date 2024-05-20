import React, { useState, useTransition, ComponentPropsWithoutRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Payers } from "./columns";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { deletePayer } from "@/actions/payers";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeletePayersDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  onSuccess?: () => void
  payers: Payers[];
  showTrigger?: boolean;
}

export default function DeletePayerDialogue({ payers, showTrigger = true,onSuccess, ...props }: DeletePayersDialogProps) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handlePayerDelete = () => {
    console.log("deletablepayres", payers);
    startDeleteTransition(() => {
      toast.promise(
        Promise.all(
          payers.map(async (payer: any) => {
            const id: string = payer.id;
            await deletePayer(id);
          })
        ),
        {
          loading: "Deleting...",
          success: () => {
            onSuccess?.();
            return "Tasks deleted";
          },
          error: () => {
            return "something went wrong";
          },
        }
      );
    });
  };

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 size-4" aria-hidden="true" />
            Delete ({payers.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        onInteractOutside={e => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={isDeletePending} onClick={handlePayerDelete}>
            {isDeletePending && <Loader2 className="size-4 mr-2 animate-spin" />}Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
