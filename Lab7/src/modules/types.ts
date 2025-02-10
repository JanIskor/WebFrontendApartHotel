export type T_Apartment = {
	id: string
	name: string
	description: string
	price: number
	image: string
	status: number
	wishes?: string
}

export type T_Application = {
	id: string | null
	status: E_ApplicationStatus
	date_complete: string
	date_created: string
	date_formation: string
	owner: string
	moderator: string
	apartments: T_Apartment[]
	start_date: string
	final_date: string
	total_price: string
}

export enum E_ApplicationStatus {
	Draft = 1,
	InWork,
	Completed,
	Rejected,
	Deleted,
}

export type T_User = {
	id: number
	username: string
	is_authenticated: boolean
	is_superuser: boolean
}

export type T_ApplicationsFilters = {
	date_formation_start: string
	date_formation_end: string
	status: E_ApplicationStatus
}

export type T_ApartmentsListResponse = {
	apartments: T_Apartment[]
	draft_application_id: number
	apartments_count: number
}

export type T_LoginCredentials = {
	username: string
	password: string
}

export type T_RegisterCredentials = {
	name: string
	email: string
	password: string
}

export enum E_ManufactureStatus {
	Draft = 1,
	InWork,
	Completed,
	Rejected,
	Deleted,
}

export type T_ApartmentAddData = {
	name: string
	description: string
	price: number
	image?: File | null
}