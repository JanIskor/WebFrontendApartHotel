// import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
// import {T_Apartment, T_ApartmentsListResponse} from "modules/types.ts";
// import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
// import {api} from "modules/api.ts";
// import {AxiosResponse} from "axios";
// import {saveApplication} from "store/slices/applicationsSlice.ts";

// type T_ApartmentsSlice = {
//     apartment_name: string
//     apartment: null | T_Apartment
//     apartments: T_Apartment[]
// }

// const initialState:T_ApartmentsSlice = {
//     apartment_name: "",
//     apartment: null,
//     apartments: []
// }

// export const fetchApartment = createAsyncThunk<T_Apartment, string, AsyncThunkConfig>(
//     "fetch_apartment",
//     async function(id) {
//         const response = await api.apartments.apartmentsRead(id) as AxiosResponse<T_Apartment>
//         return response.data
//     }
// )

// export const fetchApartments = createAsyncThunk<T_Apartment[], object, AsyncThunkConfig>(
//     "fetch_apartments",
//     async function(_, thunkAPI) {
//         const state = thunkAPI.getState();
//         const response = await api.apartments.apartmentsList({
//             apartment_name: state.apartments.apartment_name
//         }) as AxiosResponse<T_ApartmentsListResponse>

//         thunkAPI.dispatch(saveApplication({
//             draft_application_id: response.data.draft_application_id,
//             apartments_count: response.data.apartments_count
//         }))

//         return response.data.apartments
//     }
// )

// export const addApartmentToApplication = createAsyncThunk<void, string, AsyncThunkConfig>(
//     "apartments/add_apartment_to_application",
//     async function(apartment_id) {
//         await api.apartments.apartmentsAddToApplicationCreate(apartment_id)
//     }
// )

// const apartmentsSlice = createSlice({
//     name: 'apartments',
//     initialState: initialState,
//     reducers: {
//         updateApartmentName: (state, action) => {
//             state.apartment_name = action.payload
//         },
//         removeSelectedApartment: (state) => {
//             state.apartment = null
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addCase(fetchApartments.fulfilled, (state:T_ApartmentsSlice, action: PayloadAction<T_Apartment[]>) => {
//             state.apartments = action.payload
//         });
//         builder.addCase(fetchApartment.fulfilled, (state:T_ApartmentsSlice, action: PayloadAction<T_Apartment>) => {
//             state.apartment = action.payload
//         });
//     }
// })

// export const { updateApartmentName, removeSelectedApartment} = apartmentsSlice.actions;

// export default apartmentsSlice.reducer
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { T_Apartment, T_ApartmentsListResponse, T_ApartmentAddData } from 'modules/types.ts'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { api } from 'modules/api.ts'
import { AxiosResponse } from 'axios'
import { saveApplication } from 'store/slices/applicationsSlice.ts'
import { Apartment } from 'src/api/Api.ts'

type T_ApartmentsSlice = {
	apartment_name: string
	apartment: null | T_Apartment
	apartments: T_Apartment[]
}

const initialState: T_ApartmentsSlice = {
	apartment_name: '',
	apartment: null,
	apartments: [],
}

export const fetchApartment = createAsyncThunk<
	T_Apartment,
	string,
	AsyncThunkConfig
>('fetch_apartment', async function (id) {
	const response = (await api.apartments.apartmentsRead(
		id
	)) as AxiosResponse<T_Apartment>
	return response.data
})

export const fetchApartments = createAsyncThunk<
	T_Apartment[],
	object,
	AsyncThunkConfig
>('fetch_apartments', async function (_, thunkAPI) {
	const state = thunkAPI.getState()
	const response = (await api.apartments.apartmentsList({
		apartment_name: state.apartments.apartment_name,
	})) as AxiosResponse<T_ApartmentsListResponse>

	thunkAPI.dispatch(
		saveApplication({
			draft_application_id: response.data.draft_application_id,
			apartments_count: response.data.apartments_count,
		})
	)

	return response.data.apartments
})

export const addApartmentToApplication = createAsyncThunk<
	void,
	string,
	AsyncThunkConfig
>
('apartments/add_apartment_to_application', async function (apartment_id) {
	await api.apartments.apartmentsAddToApplicationCreate(apartment_id)
})

export const deleteApartment = createAsyncThunk<
	T_Apartment[],
	string,
	AsyncThunkConfig
>('delete_apartment', async function (apartment_id) {
	const response = (await api.apartments.apartmentsDeleteDelete(
		apartment_id
	)) as AxiosResponse<T_Apartment[]>
	return response.data
})

export const updateApartment = createAsyncThunk<void, object, AsyncThunkConfig>(
	'update_apartment',
	async function ({ apartment_id, data }) {
		await api.apartments.apartmentsUpdateUpdate(
			apartment_id as string,
			data as Apartment
		)
	}
)

export const updateApartmentImage = createAsyncThunk<
	void,
	object,
	AsyncThunkConfig
>('update_apartment_image', async function ({ apartment_id, data }) {
	await api.apartments.apartmentsUpdateImageCreate(
		apartment_id as string,
		data as { image?: File }
	)
})

export const createApartment = createAsyncThunk<
	void,
	T_ApartmentAddData,
	AsyncThunkConfig
>('update_apartment', async function (data) {
	await api.apartments.apartmentsCreateCreate(data)
})

const apartmentsSlice = createSlice({
	name: 'apartments',
	initialState: initialState,
	reducers: {
		updateApartmentName: (state, action) => {
			state.apartment_name = action.payload
		},
		removeSelectedApartment: state => {
			state.apartment = null
		},
	},
	extraReducers: builder => {
		builder.addCase(
			fetchApartments.fulfilled,
			(state: T_ApartmentsSlice, action: PayloadAction<T_Apartment[]>) => {
				state.apartments = action.payload
			}
		)
		builder.addCase(
			fetchApartment.fulfilled,
			(state: T_ApartmentsSlice, action: PayloadAction<T_Apartment>) => {
				state.apartment = action.payload
			}
		)
	},
})

export const { updateApartmentName, removeSelectedApartment } =
	apartmentsSlice.actions

export default apartmentsSlice.reducer