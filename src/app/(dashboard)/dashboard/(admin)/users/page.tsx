
import { getUsersByRole } from "@/data/users";
import { UserRoleEnum } from "@/db/schemas";
import React from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import Rolegate from "@/components/auth/role-gate";
import AddUser from "./_components/adduser";

type Props = {};

export default async function Userspage({}: Props) {

  const users= await getUsersByRole(UserRoleEnum.USER);

  return (
    <Rolegate allowedRole={UserRoleEnum.ADMIN}>
      <div className="container bg-white mx-auto py-10">
        <div className="space-y-3">
          <div className="flex justify-end">
          <AddUser />
          </div>
          <DataTable columns={columns} data={users ?? []} />
        </div>
      </div>
     
    </Rolegate>
  );
}
