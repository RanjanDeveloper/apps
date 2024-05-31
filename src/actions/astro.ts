'use server';

import { getRaasiDetailsByDateAndTime, getRaasiUsers } from "@/data/astro";
import { db } from "@/db";
import { raasiDetails, raasiUser } from "@/db/schemas";
import { AstrologyData } from "@/lib/store/slices/raasiDataSlice";
import { getTamilOrdinal } from "@/lib/utils";

const BASE_URL = 'https://api.prokerala.com/';
const clientId = process.env.PROKERALA_CLIENT_ID!;
const clientSecret = process.env.PROKERALA_CLIENT_SECRET!;
interface UserDetails {
    name: string;
    birth_place: string;
    birth_date: string; // Date of birth as a string in "YYYY-MM-DD" format
    birth_time: string; // Time of birth as a string in "HH:mm:ss" format
}
interface RaasiData extends AstrologyData {
    user_details:UserDetails;
   
  }

export const getAccessToken = async () => {
    const response = await fetch(`${BASE_URL}token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch access token');
    }

    const tokenData = await response.json();
    return tokenData.access_token;
};

export const fetchAstroData = async (endpoint:any, params:any, token:any) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return await response.json();
};

export const addRaasiData = async (data:RaasiData) => {
    try {
      // Check if the raasiDetails entry already exists
      const existingRaasiDetails = await getRaasiDetailsByDateAndTime(data.user_details.birth_date, data.user_details.birth_time);
      let raasiDetailsId;
      if (existingRaasiDetails.length > 0) {
          // If it exists, use the existing ID
          raasiDetailsId = existingRaasiDetails[0].id;
        } else {
          // Insert into raasiUser using the raasiDetailsId
            const {user_details,...raasi_details} = data;
          const newRaasiDetails = await db
          .insert(raasiDetails)
          .values({
            birth_date: user_details.birth_date,
            birth_time: user_details.birth_time,
            raasi: raasi_details.chandra_rasi.name,
            nakshathra: `${raasi_details.nakshatra.name} ${raasi_details.nakshatra.pada && getTamilOrdinal(raasi_details.nakshatra.pada)} பாதம்`,
            raasi_data: raasi_details
          })
          .returning();
          raasiDetailsId = newRaasiDetails[0].id;
        }
        
        const existingRaasiUsers = await getRaasiUsers(data.user_details.name,data.user_details.birth_date, data.user_details.birth_time,data.user_details.birth_place);
        if (existingRaasiUsers.length === 0){
            await db.insert(raasiUser).values({
                name: data.user_details.name,
                birth_date: data.user_details.birth_date,
                birth_time: data.user_details.birth_time,
                birth_place: data.user_details.birth_place,
                raasi_details_id: raasiDetailsId
              });
        }
        
        
     
      return { success: "Raasi data added successfully!" };
    } catch (error) {
      console.error("Error adding Raasi data:", error);
      return { error: "Failed to add Raasi data." };
    }
  };
  export const checkRaasiDetails = async (birth_date: string, birth_time: string) => {
    try {
      // Use the helper function to check if the raasiDetails entry already exists
      const existingRaasiDetails = await getRaasiDetailsByDateAndTime(birth_date, birth_time);
  
      if (existingRaasiDetails.length > 0) {
        return { raasiDetails: existingRaasiDetails[0] };
      } else {
        return { raasiDetails: null };
      }
    } catch (error) {
      console.error("Error checking Raasi details:", error);
      return { error: "Failed to check Raasi details." };
    }
  };