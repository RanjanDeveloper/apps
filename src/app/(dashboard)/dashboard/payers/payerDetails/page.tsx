"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPayerDetails } from "@/data/payers";
import FormError from "@/components/form-error";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import Loading from "./loading";
import { EventsEnum } from "@/db/schemas";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getEventTypeVariant } from "@/lib/utils";

type Props = {
  params: {
    payerId: string;
  };
};
interface Events {
  title: string;
  eventType: EventsEnum;
  amount: number;
}

interface Details {
  name: string;
  city: string;
  totalAmount: number;
  events: Events[];
}

export default function PayerDetailsPage({ params }: Props) {
  const [details, setDetails] = useState<Details>({
    name: "N/A",
    city: "N/A",
    totalAmount: 0,
    events: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const city = searchParams.get("city")?.toLowerCase()!;
  const name = searchParams.get("name")?.toLowerCase()!;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const data: any = await getPayerDetails(name, city);
        setDetails(data[0]);
      } catch (error) {
        setError("Failed to fetch payer details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [city, name]);

  if (error) return <FormError message={error} />;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="max-w-[500px]">
          <div className="flex space-x-2 justify-between">
            <div className="flex space-x-4 text-md">
              <span>Name</span>
              <span className="font-semibold">{details?.name ?? "N/A"}</span>
            </div>
            <div className="flex space-x-4 text-md">
              <span>City</span>
              <span className="font-semibold">{details?.city ?? "N/A"}</span>
            </div>
            <div className="flex space-x-4 text-md">
              <span>Total Amount</span>
              <span className="font-semibold">{formatCurrency(details?.totalAmount, "INR") ?? "N/A"}</span>
            </div>
          </div>
          <div className="mt-10">
            <div className="rounded-md border">
              <Table>
                <TableCaption className="mb-2">Here's a list of events for which the payer has paid the amount.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details?.events?.length > 0 &&
                    details.events.map((event: any, index: any) => (
                      <TableRow key={`${event.title}_${index}`}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>
                          <Badge variant={getEventTypeVariant(event.eventType)}>{event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1).toLowerCase()}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(event.amount, "INR") || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  {!details?.events?.length && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-400">
                        No events found for this payer.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
