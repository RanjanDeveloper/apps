import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { EventsEnum } from "@/db/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits:0
  }).format(amount) 
}

export function getEventTypeVariant(eventType: EventsEnum): "default" | "secondary" | "destructive" | "success" | "outline" {
  switch (eventType) {
    case EventsEnum.MARRIAGE:
      return "success";
    case EventsEnum.ENGAGEMENT:
      return "outline";
    case EventsEnum.FUNERAL:
      return "destructive";
    case EventsEnum.OTHER:
      return "secondary";
    default:
      return "default";
  }
}

export function getTamilOrdinal(n: number): string {
  const ordinals: { [key: number]: string } = {
    1: "முதல்",
    2: "இரண்டாவது",
    3: "மூன்றாவது",
    4: "நான்காவது",
  };
  return ordinals[n] || `${n}வது`;
}