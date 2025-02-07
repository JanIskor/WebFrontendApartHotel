import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {T_Application, T_ApplicationsFilters, T_Apartment} from "modules/types.ts";
import {NEXT_MONTH, PREV_MONTH} from "modules/consts.ts";
import {api} from "modules/api.ts";
import {AsyncThunkConfig} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AxiosResponse} from "axios";

type T_ApplicationsSlice = {
    draft_application_id: number | null,
    apartments_count: number | null,
    application: T_Application | null,
    applications: T_Application[],
    filters: T_ApplicationsFilters,
    save_mm: boolean
}

const initialState:T_ApplicationsSlice = {
    draft_application_id: null,
    apartments_count: null,
    application: null,
    applications: [],
    filters: {
        status: 0,
        date_formation_start: PREV_MONTH.toISOString().split('T')[0],
        date_formation_end: NEXT_MONTH.toISOString().split('T')[0]
    },
    save_mm: false
}

export const fetchApplication = createAsyncThunk<T_Application, string, AsyncThunkConfig>(
    "applications/application",
    async function(application_id) {
        const response = await api.applications.applicationsRead(application_id) as AxiosResponse<T_Application>
        return response.data
    }
)

export const fetchApplications = createAsyncThunk<T_Application[], object, AsyncThunkConfig>(
    "applications/applications",
    async function(_, thunkAPI) {
        const state = thunkAPI.getState()

        const response = await api.applications.applicationsList({
            status: state.applications.filters.status,
            date_formation_start: state.applications.filters.date_formation_start,
            date_formation_end: state.applications.filters.date_formation_end
        }) as AxiosResponse<T_Application[]>
        return response.data
    }
)

export const removeApartmentFromDraftApplication = createAsyncThunk<T_Apartment[], string, AsyncThunkConfig>(
    "applications/remove_apartment",
    async function(apartment_id, thunkAPI) {
        const state = thunkAPI.getState()
        const response = await api.applications.applicationsDeleteApartmentDelete(state.applications.application.id, apartment_id) as AxiosResponse<T_Apartment[]>
        return response.data
    }
)

export const deleteDraftApplication = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applications/delete_draft_application",
    async function(_, {getState}) {
        const state = getState()
        await api.applications.applicationsDeleteDelete(state.applications.application.id)
    }
)

export const sendDraftApplication = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applications/send_draft_application",
    async function(_, {getState}) {
        const state = getState()
        await api.applications.applicationsUpdateStatusUserUpdate(state.applications.application.id)
    }
)

export const updateApplication = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applications/update_application",
    async function(data, {getState}) {
        const state = getState()
        await api.applications.applicationsUpdateUpdate(state.applications.application.id, {
            ...data
        })
    }
)

export const updateApartmentValue = createAsyncThunk<void, object, AsyncThunkConfig>(
    "applications/update_mm_value",
    async function({apartment_id, wishes},thunkAPI) {
        const state = thunkAPI.getState()
        await api.applications.applicationsUpdateApartmentUpdate(state.applications.application.id, apartment_id, {wishes})
    }
)

const applicationsSlice = createSlice({
    name: 'applications',
    initialState: initialState,
    reducers: {
        saveApplication: (state, action) => {
            state.draft_application_id = action.payload.draft_application_id
            state.apartments_count = action.payload.apartments_count
        },
        removeApplication: (state) => {
            state.application = null
        },
        triggerUpdateMM: (state) => {
            state.save_mm = !state.save_mm
        },
        updateFilters: (state, action) => {
            state.filters = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchApplication.fulfilled, (state:T_ApplicationsSlice, action: PayloadAction<T_Application>) => {
            state.application = action.payload
        });
        builder.addCase(fetchApplications.fulfilled, (state:T_ApplicationsSlice, action: PayloadAction<T_Application[]>) => {
            state.applications = action.payload
        });
        builder.addCase(removeApartmentFromDraftApplication.rejected, (state:T_ApplicationsSlice) => {
            state.application = null
        });
        builder.addCase(removeApartmentFromDraftApplication.fulfilled, (state:T_ApplicationsSlice, action: PayloadAction<T_Apartment[]>) => {
            if (state.application) {
                state.application.apartments = action.payload as T_Apartment[]
            }
        });
        builder.addCase(sendDraftApplication.fulfilled, (state:T_ApplicationsSlice) => {
            state.application = null
        });
    }
})

export const { saveApplication, removeApplication, triggerUpdateMM, updateFilters } = applicationsSlice.actions;

export default applicationsSlice.reducer