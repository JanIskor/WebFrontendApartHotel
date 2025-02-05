import Header from '../components/Header/Header'
import Container from './components/Container'
import './index.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FormEvent, useState, useEffect } from 'react'
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import BreadCrumbs from "../components/BreadCrumbs"
import { useNavigate } from "react-router-dom";
import {Apartment, ApartmentsResult, getApartmentByPrice} from '../modules/Api'
import { APARTMENTS_MOCK } from "../modules/mock";


const Apartments = () => {
    const [searchValue, setSearchValue] = useState('')

    const [loading, setLoading] = useState(false)

    const [Apartment, setApartment] = useState<Apartment[]>([])

    const navigate = useNavigate()

    // const [Apartment, setApartment] = useState<Apartment[]>([])
    // const [isMock, setIsMock] = useState(false)
    // const [name, setName] = useState('')
    // const [cartCount, setCount] = useState(0)
    // const [draftID, setDraftID] = useState(0)

    // const fetchForecasts = async () => {
    //     try {
    //         const response = await fetch(
	// 						`/apartments/?apartment_name=${name.toLowerCase()}`,
	// 						{ signal: AbortSignal.timeout(5000) }
	// 					)

    //         if (!response.ok) {
    //             throw new Error('Network response failed')
    //         }
    //         const result = await response.json()

    //         const apartments = result.forecasts.map((apartment: any) => ({
    //             id: apartment.id,
    //             name: apartment.name,
    //             description: apartment.description,
    //             image: apartment.image,
    //             price: apartment.price,
    //             details: apartment.details,
    //         }))

    //         setApartment(apartments)
    //         setCount(result.draft_count || 0)
    //         setDraftID(result.draft_id)
    //         setIsMock(false)
    //     } catch (error) {
    //         console.error('Fetch error:', error)
    //         if (!isMock) {
    //             createMocks()
    //         }
    //     }
    // }

    // const createMocks = () => {
    //     setIsMock(true)
    //     setApartment(
	// 				APARTMENTS_MOCK.services.filter(forec =>
	// 					forec.name.toLowerCase().includes(name.toLowerCase())
	// 				)
	// 			)
    // }

    // const handleSubmit = async (e: FormEvent) => {
    //     e.preventDefault()
    //     await fetchForecasts()
    // }

    // useEffect(() => {
    //     fetchForecasts()
    // }, [])








    const handleSearch = async () => {
        await setLoading(true)
        const { services } = await getApartmentByPrice(searchValue)
        await setApartment(services)
        await setLoading(false)
        console.log(services)
    }

    useEffect(() => {
        const fetchApartments = async () => {
            setLoading(true);
            const { services } = await getApartmentByPrice(); 
            setApartment(services);
            setLoading(false);
        };
        fetchApartments();
    }, []); // Empty dependency array to run only once on mount

    return (
        <>
            <Header />
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.APARTMENTS }]} />
            <div className="form-container">
                <Form className='w-75'>
                    <Row >
                        <Col >
                            <Form.Control
                                type="text"
                                //name="visa_price"
                                placeholder="Поиск по названию"
                                value={searchValue}
                                onChange={(event => setSearchValue(event.target.value))}
                                className=" mr-sm-2"
                            //
                            />
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-warning" 
                            type="submit" disabled={loading} onClick={handleSearch} >Поиск</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className='space'>
                <p className="main_title">Апартаменты & Услуги</p>
                {!loading &&
                    (!Apartment.length /* Проверка на существование данных */ ? (
                        <div>
                            <h1 className="not-found">К сожалению, пока ничего не найдено :(</h1>
                        </div>) : (
                        <div className='custom-container'><Container Apartment={Apartment} navigate={navigate} /></div>
                    )
                    )}
            </div>
        </>
    )
}
export default Apartments

