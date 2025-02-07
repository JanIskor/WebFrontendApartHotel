import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    fetchApplications,
    updateFilters
} from "store/slices/applicationsSlice.ts";
import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.tsx";
import {T_ApplicationsFilters} from "modules/types.ts";
import ApplicationsTable from "components/ApplicationsTable/ApplicationsTable.tsx";
import {useNavigate} from "react-router-dom";

const ApplicationsPage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const applications = useAppSelector((state) => state.applications.applications)

    const filters = useAppSelector<T_ApplicationsFilters>((state) => state.applications.filters)

    const {is_authenticated} = useAppSelector((state) => state.user)

    const [status, setStatus] = useState(filters.status)

    const [dateFormationStart, setDateFormationStart] = useState(filters.date_formation_start)

    const [dateFormationEnd, setDateFormationEnd] = useState(filters.date_formation_end)

    const statusOptions = {
        0: "Любой",
        2: "В работе",
        3: "Завершен",
        4: "Отклонен"
    }

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        dispatch(fetchApplications())
    }, [filters]);

    const applyFilters = async (e) => {
			e.preventDefault()

			const filters: T_ApplicationsFilters = {
				status: status,
				date_formation_start: dateFormationStart,
				date_formation_end: dateFormationEnd,
			}

			await dispatch(updateFilters(filters));
		}

    return (
        <Container>
            <Form onSubmit={applyFilters}>
                <Row className="mb-4 d-flex align-items-center">
                    <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                        <label>От</label>
                        <Input type="date" value={dateFormationStart} onChange={(e) => setDateFormationStart(e.target.value)} required/>
                    </Col>
                    <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                        <label>До</label>
                        <Input type="date" value={dateFormationEnd} onChange={(e) => setDateFormationEnd(e.target.value)} required/>
                    </Col>
                    <Col md="3">
                        <CustomDropdown label="Статус" selectedItem={status} setSelectedItem={setStatus} options={statusOptions} />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button color="primary" type="submit">Применить</Button>
                    </Col>
                </Row>
            </Form>
            {applications.length ? <ApplicationsTable applications={applications}/> : <h3 className="text-center mt-5">Заявления не найдены</h3>}
        </Container>
    )
};

export default ApplicationsPage