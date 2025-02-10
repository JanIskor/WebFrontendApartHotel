import {Button, Card, Col, Row} from "reactstrap";
import {E_ApplicationStatus, T_Application} from "modules/types.ts";
import {formatDate} from "utils/utils.ts";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {acceptApplication, fetchApplications, rejectApplication} from "store/slices/applicationsSlice.ts";

type Props = {
    application: T_Application
    index: number
}

const ApplicationCard = ({application, index}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleAcceptApplication = async (application_id) => {
        await dispatch(acceptApplication(application_id))
        await dispatch(fetchApplications())
    }

    const handleRejectApplication = async (application_id) => {
        await dispatch(rejectApplication(application_id))
        await dispatch(fetchApplications())
    }

    const navigate = useNavigate()

    const openApplicationPage = () => {
        navigate(`/applications/${application.id}`)
    }

    const STATUSES = {
        1: "Введен",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    return (
        <Card style={{padding: "10px"}}>
            <Row>
                <Col md={1}>
                    {index + 1}
                </Col>
                <Col md={1}>
                    {STATUSES[application.status]}
                </Col>
                {/* <Col md={1}>
                    {application.marriage != null ? application.marriage ? "Да" : "Нет" : ""}
                </Col> */}
                <Col>
                    {formatDate(application.date_created)}
                </Col>
                <Col>
                    {formatDate(application.date_formation)}
                </Col>
                <Col>
                    {formatDate(application.date_complete)}
                </Col>
                {!is_superuser &&
                    <Col>
                        <Button color="primary" onClick={openApplicationPage}>Открыть</Button>
                    </Col>
                }
                {is_superuser &&
                    <>
                        <Col>
                            {application.owner}
                        </Col>
                        <Col>
                            {application.status == E_ApplicationStatus.InWork && <Button color="primary" onClick={() => handleAcceptApplication(application.id)}>Принять</Button>}
                        </Col>
                        <Col>
                            {application.status == E_ApplicationStatus.InWork && <Button color="primary" onClick={() => handleRejectApplication(application.id)}>Отклонить</Button>}
                        </Col>
                    </>
                }
            </Row>
        </Card>
    )
}

export default ApplicationCard