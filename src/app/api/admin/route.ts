// app/api/route.js
import { NextResponse } from "next/server";
import { addUser } from "@/data/users";
import { currentRole } from "@/lib/auth";
import { UserRoleEnum } from "@/db/schemas";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // const newStudent = await createStudent(name,job,age);
  const user = await addUser(name, email, password);
  return NextResponse.json(user);
}

export async function GET() {
  const role = await currentRole();
  if (role === UserRoleEnum.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
