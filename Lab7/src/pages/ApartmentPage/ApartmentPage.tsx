import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchApartment, removeSelectedApartment} from "store/slices/apartmentsSlice.ts";

const ApartmentPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {apartment} = useAppSelector((state) => state.apartments)

    useEffect(() => {
        dispatch(fetchApartment(id))
        return () => dispatch(removeSelectedApartment())
    }, []);

    if (!apartment) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={apartment.image}
                        className="w-100 rounded-3"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{apartment.name}</h1>
                    <p className="fs-5">Описание: {apartment.description}</p>
                    <p className="fs-5">Цена: {apartment.price} руб.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ApartmentPage