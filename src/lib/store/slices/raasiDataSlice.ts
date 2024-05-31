import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

// Define a type for the slice state

// Define a type for the slice state
interface Deity {
    deity: string;
    ganam: string;
    symbol: string;
    animal_sign: string;
    nadi: string;
  }
  
  interface Rasi {
    id: number;
    name: string;
    lord: {
      id: number,
      name: string,
    };
  }
  
  interface Nakshatra {
    id: number;
    name: string;
    lord: {
      id: number,
      name: string,
      vedic_name: string,
    };
    pada: number;
  }
    interface UserDetails {
    name: string;
    birth_date: string;
    birth_time: string;
    birth_place: string;
    
  }


  interface AdditionalInfo {
    animal_sign: string;
    best_direction: string;
    birth_stone: string;
    color: string;
    deity:string;
    enemy_yoni: string;
    ganam: string;
    gender: string;
    nadi: string;
    planet: string;
    syllables: string;
    symbol: string;
  }
  
  export interface AstrologyData {
    additional_info: AdditionalInfo;
    deity: Deity;
    chandra_rasi: Rasi;
    nakshatra: Nakshatra;
    soorya_rasi: Rasi;
    zodiac: {
      id: number;
      name: string;
    };
    user_details:UserDetails;
  }
  
  // Define a type for the slice state
  interface RaasiState {
    value: AstrologyData | null;
  }
  
export const initialState : RaasiState = {
    value:null
}


export const raasiSlice = createSlice({
    name : 'raasiData',
    initialState,
    reducers: {
        setRaasiData : (state,action:PayloadAction<AstrologyData>)=>{
            state.value = action.payload
        },
       
 
    }
})

export const {setRaasiData} = raasiSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getRaasiData = (state: RootState) => state.raasiData.value

export default raasiSlice.reducer