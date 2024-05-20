import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import { adminApi } from "./apiSlices/adminApi";
import { setupListeners } from '@reduxjs/toolkit/query'
export const makeStore = ()=>{
    return  configureStore({
        reducer: {
            counter : counterReducer,
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

