import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import apartmentsReducer from "./slices/apartmentsSlice.ts"

export const store = configureStore({
    reducer: {
        apartments: apartmentsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;