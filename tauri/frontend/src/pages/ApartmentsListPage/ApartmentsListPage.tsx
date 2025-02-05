import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import ApartmentCard from "components/ApartmentCard/ApartmentCard.tsx";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {RootState, useAppSelector} from "src/store/store.ts";
import {updateApartmentName} from "src/store/slices/apartmentsSlice.ts";
import {T_Apartment} from "modules/types.ts";
import {ApartmentMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";
import "./styles.css"
import {isTauri} from "@tauri-apps/api/core";

type Props = {
    apartments: T_Apartment[],
    setApartments: React.Dispatch<React.SetStateAction<T_Apartment[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const ApartmentsListPage = ({apartments, setApartments, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {apartment_name} = useAppSelector((state:RootState) => state.apartments)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateApartmentName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setApartments(ApartmentMocks.filter(apartment => apartment.name.toLowerCase().includes(apartment_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchApartments()
    }

    const fetchApartments = async () => {
        try {
            const env = await import.meta.env;
            const apiUrl = isTauri() ? env.VITE_API_URL : ""
            const response = await fetch(`${apiUrl}/api/apartments/?apartment_name=${apartment_name.toLowerCase()}`)
            const data = await response.json()
            setApartments(data.apartments)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchApartments()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={apartment_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {apartments?.map(apartment => (
                    <Col key={apartment.id} sm="12" md="6" lg="4">
                        <ApartmentCard apartment={apartment} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ApartmentsListPage