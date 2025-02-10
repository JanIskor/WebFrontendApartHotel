import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchApartments, updateApartmentName} from "store/slices/apartmentsSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import ApartmentsTable from "components/ApartmentsTable/ApartmentsTable.tsx";

const ApartmentsTablePage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {apartments, apartment_name} = useAppSelector((state) => state.apartments)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateApartmentName(e.target.value))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchApartments())
    }

    useEffect(() => {
        dispatch(fetchApartments())
    }, [])

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_authenticated, is_superuser]);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={apartment_name} onChange={handleChange} placeholder="Поиск по имени"></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className="d-flex flex-row justify-content-end" md="6">
                    <Link to="/apartments/add">
                        <Button color="primary">Создать услугу</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {apartments.length > 0 ? <ApartmentsTable apartments={apartments} fetchApartments={fetchApartments}/> : <h3 className="text-center mt-5">Услуги не найдены</h3>}
            </Row>
        </Container>
    );
};

export default ApartmentsTablePage