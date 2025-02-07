import {configureStore, ThunkDispatch} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import userReducer from "./slices/userSlice.ts"
import applicationsReducer from "./slices/applicationsSlice.ts"
import apartmentsReducer from "./slices/apartmentsSlice.ts"

export const store = configureStore({
    reducer: {
        user: userReducer,
        applications: applicationsReducer,
        apartments: apartmentsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, never, never>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;