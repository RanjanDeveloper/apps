
import React from "react";

import { getCurrentUserEvents } from "@/data/events";
import { DataTable } from "./_components/data-table";
import {  Events, columns } from "./_components/columns";
import AddEvent from "./_components/add-event";

const dynamic = 'force-dynamic';
const revalidate = 0;

type Props = {};

export default async function EventsPage({}: Props) {

  const start = new Date();
const events:any = await getCurrentUserEvents();
const end = new Date();
const executionTime = end.getTime() - start.getTime();
console.log(`getCurrentUserEvents took ${executionTime} milliseconds to execute`);

  
  return (
    <div className="space-y-3">
        <div className="flex justify-end">
        <AddEvent />
        </div>

        <DataTable columns={columns} data={events ?? []} />
      </div>
  );
}
