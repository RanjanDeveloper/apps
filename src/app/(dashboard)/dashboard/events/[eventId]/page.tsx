import React from "react";
import { getCurrentEvent } from "@/actions/events";
import AddPayer from "./_components/add-payer";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

type Props = {
  params: {
    eventId: string;
  };
};

export default async function EventDetailsPage({ params }: Props) {
  const payers: any = await getCurrentEvent(params.eventId);

  return (
    <>
      {payers.error ? (
        <h1>{payers.error}</h1>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <AddPayer eventId={params.eventId} />
          </div>

          <DataTable columns={columns} data={payers ?? []} />
        </div>
      )}
    </>
  );
}
