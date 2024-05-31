"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select"; // Adjust the import path as needed
import { SelectGroup } from "@radix-ui/react-select";

interface TimePickerSelectProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const generateOptions = (start: number, end: number): string[] => {
  const options: string[] = [];
  for (let i = start; i <= end; i++) {
    options.push(i.toString().padStart(2, "0"));
  }
  return options;
};

const hoursOptions = generateOptions(1, 12);
const minutesOptions = generateOptions(0, 59);
const secondsOptions = generateOptions(0, 59);
const periodOptions = ["AM", "PM"];

const updateDate = (
  date: Date | undefined,
  setDate: (date: Date | undefined) => void,
  part: "hours" | "minutes" | "seconds" | "period",
  value: string
) => {
  if (!date) return;

  const newDate = new Date(date);
  if (part === "hours") {
    newDate.setHours(value === "12" ? 0 : parseInt(value, 10));
  } else if (part === "minutes") {
    newDate.setMinutes(parseInt(value, 10));
  } else if (part === "seconds") {
    newDate.setSeconds(parseInt(value, 10));
  } else if (part === "period") {
    const hours = newDate.getHours();
    if (value === "AM" && hours >= 12) {
      newDate.setHours(hours - 12);
    } else if (value === "PM" && hours < 12) {
      newDate.setHours(hours + 12);
    }
  }
  setDate(newDate);
};

export const TimePickerSelect: React.FC<TimePickerSelectProps> = ({
  date,
  setDate,
}) => {
  const hour = date ? (date.getHours() % 12 || 12).toString().padStart(2, "0") : "12";
  const minute = date ? date.getMinutes().toString().padStart(2, "0") : "00";
  const second = date ? date.getSeconds().toString().padStart(2, "0") : "00";
  const period = date && date.getHours() >= 12 ? "PM" : "AM";

  return (
    <div className="flex space-x-2 items-center">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Select onValueChange={(value) => updateDate(date, setDate, "hours", value)}>
          <SelectTrigger>
           
            <SelectValue placeholder={hour} />
          </SelectTrigger>
          <SelectContent className="max-h-40">
           <SelectGroup>
           <SelectLabel>Hour</SelectLabel>
           {hoursOptions.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
           </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Select onValueChange={(value) => updateDate(date, setDate, "minutes", value)}>
          <SelectTrigger>
            
            <SelectValue placeholder={minute} />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            <SelectGroup>
            <SelectLabel>Minute</SelectLabel>
            {minutesOptions.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
            </SelectGroup>
           
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Seconds
        </Label>
        <Select onValueChange={(value) => updateDate(date, setDate, "seconds", value)}>
          <SelectTrigger>
         
            <SelectValue placeholder={second} />
          </SelectTrigger>
          <SelectContent className="max-h-40">
          <SelectGroup>
          <SelectLabel>Second</SelectLabel>
          {secondsOptions.map((second) => (
              <SelectItem key={second} value={second}>
                {second}
              </SelectItem>
            ))}
          </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <Select onValueChange={(value) => updateDate(date, setDate, "period", value)}>
          <SelectTrigger>
           
            <SelectValue placeholder={period} />
          </SelectTrigger>
          <SelectContent className="max-h-40">
           <SelectGroup>
           <SelectLabel>Period</SelectLabel>
           {periodOptions.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
           </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
