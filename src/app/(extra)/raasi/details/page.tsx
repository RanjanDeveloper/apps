"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { getRaasiData } from "@/lib/store/slices/raasiDataSlice";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTamilOrdinal } from "@/lib/utils";
type Props = {};


export default function Page({}: Props) {
  const router = useRouter();
  const raasiData = useAppSelector(getRaasiData);

  useEffect(() => {
    if (raasiData === null) {
      router.push("/raasi");
    }
  }, [raasiData, router]);

  if (!raasiData) {
    return null; // or a loading indicator
  }

  const { chandra_rasi, nakshatra, additional_info, user_details } = raasiData;

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="max-w-md mx-auto">
        <div className="border rounded-md shadow-lg bg-white *:p-4 ">
          <div className="rounded-t-md font-bold bg-slate-200">Your details</div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold w-1/2">பெயர்</TableCell>
                <TableCell className="w-1/2">{user_details.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">பிறந்த தேதி</TableCell>
                <TableCell>{user_details.birth_date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">பிறந்த நேரம்</TableCell>
                <TableCell>{user_details.birth_time}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 border rounded-md shadow-lg bg-white *:p-4 ">
          <div className="rounded-t-md font-bold bg-slate-200">Birth details</div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold w-1/2">ராசி</TableCell>
                <TableCell className="text-green-500 font-semibold w-1/2">{chandra_rasi.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">ராசி அதிபதி</TableCell>
                <TableCell>{chandra_rasi.lord.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">நட்சத்திரம்</TableCell>
                <TableCell className="text-green-500 font-semibold">{`${nakshatra.name} ${nakshatra.pada && getTamilOrdinal(nakshatra.pada)} பாதம்`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-bold">நட்சத்திர அதிபதி</TableCell>
                <TableCell>{nakshatra.lord.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">நட்சத்திர தேவதை</TableCell>
                <TableCell>{additional_info.deity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">மிருகம்</TableCell>
                <TableCell>{additional_info.animal_sign}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">நிறம்</TableCell>
                <TableCell>{additional_info.color}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        
        </div>
        <Button asChild className="mt-5 w-full">
            <Link href="/raasi">Back to home</Link>
          </Button>
      </div>
    </div>
  );
}
