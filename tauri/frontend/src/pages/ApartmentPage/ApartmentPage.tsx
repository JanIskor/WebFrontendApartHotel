import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {CardImg, Col, Container, Row} from "reactstrap";
import mockImage from "assets/mock.png";
import {T_Apartment} from "modules/types.ts";
import {ApartmentMocks} from "modules/mocks.ts";
import {isTauri} from "@tauri-apps/api/core";

type Props = {
    selectedApartment: T_Apartment | null,
    setSelectedApartment: React.Dispatch<React.SetStateAction<T_Apartment | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const ApartmentPage = ({selectedApartment, setSelectedApartment, isMock, setIsMock}: Props) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const env = await import.meta.env;
            const apiUrl = isTauri() ? env.VITE_API_URL : ""
            const response = await fetch(`${apiUrl}/api/apartments/${id}`)
            const data = await response.json()
            setSelectedApartment(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedApartment(ApartmentMocks.find(apartment => apartment?.id == parseInt(id as string)) as T_Apartment)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedApartment(null)
    }, []);

    if (!selectedApartment) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <CardImg src={isMock ? mockImage as string : selectedApartment.image} className="mb-3" />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedApartment.name}</h1>
                    <p className="fs-5">Описание: {selectedApartment.description}</p>
                    <p className="fs-5">Цена: {selectedApartment.price} руб.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ApartmentPage