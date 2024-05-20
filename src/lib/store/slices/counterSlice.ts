import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

// Define a type for the slice state
interface CounterState {
    value: number
  }
export const initialState : CounterState = {
    value:100
}


export const counterSlice = createSlice({
    name : 'counter',
    initialState,
    reducers: {
        increment : (state)=>{
            state.value += 1
        },
        decrement : (state) => {
            state.value -= 1
        },
        incrementByValue : (state,action:PayloadAction<number>)=>{
            state.value += action.payload
        }
 
    }
})

export const {increment,decrement,incrementByValue} = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.counter.value

export default counterSlice.reducer