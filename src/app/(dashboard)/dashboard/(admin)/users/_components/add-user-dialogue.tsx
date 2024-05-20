"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, Form, FormItem, FormDescription, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import FormSuccess from "@/components/form-success";
import FormError from "@/components/form-error";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { AddUserSchema } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adduser } from "@/actions/admin";
import { toast } from "sonner";
import { UserRoleEnum } from "@/db/schemas";
type Props = {
  isOpen: boolean;
  onAddUserOpenChanges: any;
};

export default function AddUserDialogue({ isOpen, onAddUserOpenChanges }: Props) {

  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role:UserRoleEnum.USER,
      isTwoFactorEnabled: false,
    },
  });
  const [isPending, startTransition] = useTransition();
  const submitHandler = (values: z.infer<typeof AddUserSchema>) => {
    startTransition(() => {
      adduser(values)
        .then(data => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            onAddUserOpenChanges(false);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onAddUserOpenChanges}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader className="font-bold">Add User</DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="John Doe" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Johndoe@gmail.com" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="********" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel showError={false}>Role</FormLabel>
                          <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a value" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={UserRoleEnum.ADMIN}>Admin</SelectItem>
                              <SelectItem value={UserRoleEnum.USER}>User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="spece-y-0.5">
                        <FormLabel showError={false}>Two Factor Authentication</FormLabel>
                        <FormDescription>Enable two factor authentication for your account</FormDescription>
                      </div>
                      <FormControl>
                        <Switch disabled={isPending} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={isPending} type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
