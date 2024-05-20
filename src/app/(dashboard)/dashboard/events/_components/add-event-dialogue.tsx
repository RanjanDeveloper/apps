"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { FormField, Form, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { AddEventSchema } from "@/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addPayer } from "@/actions/payers";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addEvent } from "@/actions/events";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EventsEnum } from "@/db/schemas";
type Props = {
  isOpen: boolean;
  onAddEventOpenChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddEventDialogue({ isOpen, onAddEventOpenChanges }: Props) {
  const [isCalenderOpen, setIsCalenderOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AddEventSchema>>({
    resolver: zodResolver(AddEventSchema),
    defaultValues: {
      title: "",
      eventType: undefined,
      date: undefined,
      place: "",
    },
  });

  const submitHandler = (values: z.infer<typeof AddEventSchema>) => {
    startTransition(() => {
      addEvent(values)
        .then(data => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            toast.success(data.success);
            onAddEventOpenChanges(false);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onAddEventOpenChanges} modal>
      <DialogContent
        onInteractOutside={e => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader className="font-bold">Add Event</DialogHeader>

            <div className="space-y-4 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter the event name" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Event type</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EventsEnum.MARRIAGE}>Marriage</SelectItem>
                        <SelectItem value={EventsEnum.ENGAGEMENT}>Engagement</SelectItem>
                        <SelectItem value={EventsEnum.FUNERAL}>Funeral</SelectItem>
                        <SelectItem value={EventsEnum.OTHER}>Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Event Date</FormLabel>
                    <Popover open={isCalenderOpen} onOpenChange={setIsCalenderOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full", !field.value && "text-slate-500")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="size-4 ml-auto opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="">
                        <Calendar
                          mode="single"
                          className="!p-0"
                          selected={field.value}
                          onSelect={date => {
                            field.onChange(date);
                            setIsCalenderOpen(false);
                          }}
                          disabled={date => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showError={false}>Place</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Enter the event place" disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={isPending}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
