
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getCurrentUserPayers } from "@/data/payers";


type Props = {};

export default async function PayersPage({}: Props) {
  
 const payers:any = await getCurrentUserPayers();
//  console.log("poayers",{payers});
  return (
    <div className="space-y-3">
        <DataTable columns={columns} data={payers ?? []} />
      </div>
  );
}
