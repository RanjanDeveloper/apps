import { configureStore } from "@reduxjs/toolkit";
import raasiDataReducer from "./slices/raasiDataSlice";
import { adminApi } from "./apiSlices/adminApi";
import { setupListeners } from '@reduxjs/toolkit/query'
export const makeStore = ()=>{
    return  configureStore({
        reducer: {
           raasiData : raasiDataReducer,
            [adminApi.reducerPath]:adminApi.reducer
        },
        middleware:(getDefaultMiddleware)=> 
            getDefaultMiddleware().concat(adminApi.middleware),
        
    
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

