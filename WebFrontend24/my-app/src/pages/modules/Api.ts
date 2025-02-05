import { APARTMENTS_MOCK } from "../modules/mock";

export interface Apartment {
	id: number
	name: string
	description: string
	image: string
	price: number
	details: string
}
export interface ApartmentsResult {
  user_draft_app_id: number | null;
  number_of_services: number;
  services: Apartment[];
}


export const getApartmentByPrice = async (name = ''): Promise<ApartmentsResult> => {
  return (
		fetch(
			`http://127.0.0.1:8000/api/apart_services/?apart_hotel_service_name=${name}`
		)
			.then(response => response.json())
			//.catch(() => ({ /*resultCount:0,*/ services: [] }))

			.catch(() => {
				if (name === '') {
					return { services: APARTMENTS_MOCK.services }
				}
				return {
					services: APARTMENTS_MOCK.services.filter(item =>
						item.name.toLowerCase().includes(name.toLowerCase())
					),
				}
			})
	)
}

// export const getApartmentByPrice = async (name = ''): Promise<Apartment[]> => {
// 	try {
// 		const response = await fetch(
// 			`http://127.0.0.1:8000/apartments/?apartment_name=${name}`
// 		)
// 		console.log('Статус ответа:', response.status)

// 		if (!response.ok) {
// 			console.error('Ошибка при получении данных:', response.status)
// 			return APARTMENTS_MOCK.services
// 		}
// 		const data: { works: Apartment[] } = await response.json()
// 		return data.works
// 	} catch (error) {
// 		console.log('Ошибка:', error)
// 		return APARTMENTS_MOCK.services
// 	}
// }


export const getApartmentById = async (
  id: number | string
): Promise<Apartment> => {
  // return fetch(`http://127.0.0.1:8000/apartments/${id}`)
	// 	.then(response => response.json())
    
	// 	.catch(() => {
	// 		const apartment = APARTMENTS_MOCK.services.find(
	// 			service => service.id === Number(id)
	// 		)
	// 		console.log(apartment)
	// 		return apartment || null
	// 	})
    try {
			const response = await fetch(
				`http://127.0.0.1:8000/api/apart_service/${id}/`
			)
			if (!response.ok) {
				throw new Error(`Не удалось получить элемент с id ${id}`)
			}
			console.log(response)
			return response.json()
		} catch (error) {
			console.error(error)
			throw error
		}
};

