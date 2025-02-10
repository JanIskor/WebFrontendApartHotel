import { Button, Col, Container, Form, Input, Row } from 'reactstrap'
import { ChangeEvent, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/store.ts'
import {
	fetchApartments,
	updateApartmentName,
} from 'store/slices/apartmentsSlice.ts'
import ApartmentCard from 'components/ApartmentCard/ApartmentCard.tsx'
import Bin from 'components/Bin/Bin.tsx'

const ApartmentsListPage = () => {
	const dispatch = useAppDispatch()

	const { apartments, apartment_name } = useAppSelector(
		state => state.apartments
	)

	const { is_authenticated, is_superuser } = useAppSelector(state => state.user)

	const { draft_application_id, apartments_count } = useAppSelector(
		state => state.applications
	)

	const hasDraft = draft_application_id != null

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch(updateApartmentName(e.target.value))
	}

	const handleSubmit = e => {
		e.preventDefault()
		dispatch(fetchApartments())
	}

	useEffect(() => {
		dispatch(fetchApartments())
	}, [])

	return (
		<Container>
			<Row className='mb-5'>
				<Col md='6'>
					<Form onSubmit={handleSubmit}>
						<Row>
							<Col xs='8'>
								<Input
									value={apartment_name}
									onChange={handleChange}
									placeholder='поиск по названию'
								></Input>
							</Col>
							<Col>
								<Button color='primary' className='w-100 search-btn'>
									Поиск
								</Button>
							</Col>
						</Row>
					</Form>
				</Col>
				{is_authenticated && !is_superuser && (
					<Col className='d-flex flex-row justify-content-end' md='6'>
						<Bin
							isActive={hasDraft}
							draft_application_id={draft_application_id}
							apartments_count={apartments_count}
						/>
					</Col>
				)}
			</Row>
			<Row className='mt-5 d-flex'>
				{apartments?.map(apartment => (
					<Col
						key={apartment.id}
						className='mb-4 d-flex justify-content-center'
						sm='12'
						md='6'
						lg='4'
					>
						<ApartmentCard
							apartment={apartment}
							showAddBtn={is_authenticated}
						/>
					</Col>
				))}
			</Row>
		</Container>
	)
}

export default ApartmentsListPage

