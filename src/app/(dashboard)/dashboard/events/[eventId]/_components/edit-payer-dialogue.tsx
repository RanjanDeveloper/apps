"use client";
import React, { useTransition ,ComponentPropsWithoutRef} from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { FormField, Form, FormItem, FormDescription, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditPayerSchema } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPayer } from "@/actions/payers";
import { toast } from "sonner";
import { type Payers } from "./columns";
import { Textarea } from "@/components/ui/textarea";
import { type Row } from "@tanstack/react-table";

interface Props  extends ComponentPropsWithoutRef<typeof Dialog> {
  payer: Payers;
  onSuccess?:()=> void;
};

export default function EditPayerDialog({ payer,onSuccess,...props }: Props) {
  const form = useForm<z.infer<typeof EditPayerSchema>>({
    resolver: zodResolver(EditPayerSchema),
    defaultValues: {
      name: payer.name|| undefined,
      city: payer.city || undefined,
      amount: payer.amount || 0,
      description: payer.description || undefined
    },
  });
  const [isPending, startTransition] = useTransition();
  const submitHandler = (values: z.infer<typeof EditPayerSchema>) => {
    startTransition(() => {
      const id: string = payer.id;
      editPayer(values, id)
        .then(data => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            toast.success(data.success);
            onSuccess?.();
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <Dialog {...props}>
      <DialogContent
        onInteractOutside={e => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader className="font-bold">Edit Payer </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Ranjan" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Place</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Kannikapuri" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onBlur={e => {
                          if (!e.target.value) {
                            field.onChange(0);
                          }
                        }}
                        onChange={field.onChange}
                        placeholder="Enter amount"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
