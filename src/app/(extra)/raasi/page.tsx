"use client";
import { getAccessToken, fetchAstroData, checkRaasiDetails, addRaasiData } from "@/actions/astro";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, getYear } from "date-fns";
import { cn, getTamilOrdinal } from "@/lib/utils";
import { TimePicker12Demo } from "@/components/shadcnextra/time-picker-12h-demo";
import { useAppDispatch } from "@/lib/store/hooks";
import { setRaasiData } from "@/lib/store/slices/raasiDataSlice";
import { useRouter } from "next/navigation";
import { TimePickerSelect } from "@/components/shadcnextra/time-picker-select";


type Props = {};

export default function page({}: Props) {

  const [isCalenderOpen, setIsCalenderOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const raasiSchema = z.object({
    name: z.string().min(1, "Name is required"),
    birth_place:z.string().min(1, "Place is required"),
    dob: z.date({
      required_error: "Date is required",
      invalid_type_error: "That's not a date!",
    }),
    time: z.date({
      required_error: "Time is required",
      invalid_type_error: "That's not a time!",
    }),
  });
  const form = useForm<z.infer<typeof raasiSchema>>({
    resolver: zodResolver(raasiSchema),
    defaultValues: {
      name: "",
      birth_place:"",
      dob: undefined,
      time: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });

  const submitHandler = async (values: z.infer<typeof raasiSchema>) => {
    startTransition(async () => {
      try {
        const formattedDate = format(values.dob, "dd MMMM yyyy");
        const formattedTime = format(values.time, "h:mm:ss a");

        // Check if raasi details already exist
        const existingRaasiDetails = await checkRaasiDetails(formattedDate, formattedTime);
debugger;
        let raasi_data;
        
        if (existingRaasiDetails.raasiDetails) {
          raasi_data = existingRaasiDetails.raasiDetails.raasi_data;
        } else {
          const token = await getAccessToken();
          const datetime = new Date(values.dob);
          datetime.setHours(values.time.getHours());
          datetime.setMinutes(values.time.getMinutes());
          datetime.setSeconds(values.time.getSeconds());

          const result = await fetchAstroData(
            "v2/astrology/birth-details",
            {
              ayanamsa: 1,
              coordinates: "23.1765,75.7885",
              datetime: datetime.toISOString(),
              la: "ta",
            },
            token
          );
          raasi_data = result.data;
        }
        const userDetails = {
          name: values.name,
          birth_place: values.birth_place,
          birth_date: formattedDate,
          birth_time: formattedTime,
        }
        const combinedData = {
         user_details: userDetails,
         ...raasi_data
        };

        const addResult = await addRaasiData(combinedData);
        debugger;
        if (!addResult.success) {
          console.error("Failed to add Raasi data:", addResult.error);
        }
        dispatch(setRaasiData(combinedData));

        router.push("/raasi/details");
      } catch (error) {
        console.error(error);
      }
    });
  };
  const handleTime = (field:any,date:any)=> {
    debugger;
    console.log(date);
    field.onChange(date);
  }
  return (
    <div className="max-w-sm mx-auto w-full">
      <p className="text-3xl font-bold text-center mt-10 flex flex-col">Find Your Zodiac Sign <span className="font-semibold text-sm">(உங்கள் ராசியை கணக்கிடவும்)</span></p>
      <Form {...form}>
        <form className="space-y-4 md:space-y-6 p-4 mt-5" onSubmit={form.handleSubmit(submitHandler)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel showError={false}>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Romeo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel showError={false}>Date of birth</FormLabel>
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
                      captionLayout="dropdown-buttons"
                      selected={field.value}
                      fromYear={1950}
                      toYear={getYear(new Date())}
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
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel showError={false}>Birth Time</FormLabel>
                <TimePickerSelect date={field.value} setDate={(date)=>handleTime(field,date)} />
                  <FormDescription>
                  Entering the correct time will ensure accurate Natchathira (birth star) calculation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="birth_place"
            render={({ field }) => (
              <FormItem>
                <FormLabel showError={false}>Birth Place</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Chennai" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
