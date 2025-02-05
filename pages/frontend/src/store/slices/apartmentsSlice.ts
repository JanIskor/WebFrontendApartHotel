import {createSlice} from "@reduxjs/toolkit";

type T_ApartmentsSlice = {
    apartment_name: string
}

const initialState:T_ApartmentsSlice = {
    apartment_name: "",
}


const apartmentsSlice = createSlice({
    name: 'apartments',
    initialState: initialState,
    reducers: {
        updateApartmentName: (state, action) => {
            state.apartment_name = action.payload
        }
    }
})

export const { updateApartmentName} = apartmentsSlice.actions;

export default apartmentsSlice.reducer