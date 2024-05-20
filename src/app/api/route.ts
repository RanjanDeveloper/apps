// app/api/route.js
import { NextResponse } from "next/server";
import { getUserByEmail, getUsers } from "@/data/users";


// Handles GET requests to /api
export async function GET() {
  // const fetchedStudents = await getStudents();
  const fetchedAdmins= await getUsers();

  return NextResponse.json(fetchedAdmins);
}

export async function POST(request: Request) {
  const { email } = await request.json();

  // const newStudent = await createStudent(name,job,age);
  const user = await getUserByEmail(email);
  console.log(user);
  return NextResponse.json(user);
  
}