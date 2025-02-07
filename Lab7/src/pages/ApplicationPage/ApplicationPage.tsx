import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftApplication,
    fetchApplication,
    removeApplication, sendDraftApplication,
    triggerUpdateMM,
    updateApplication
} from "store/slices/applicationsSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ApplicationStatus, T_Apartment} from "modules/types.ts";
import ApartmentCard from "components/ApartmentCard/ApartmentCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomDatePicker from "components/CustomDatePicker/CustomDatePicker.tsx";

const ApplicationPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated} = useAppSelector((state) => state.user)

    const application = useAppSelector((state) => state.applications.application)

    const [start_date, setStart_date] = useState<string>(application?.start_date)

    const [final_date, setFinal_date] = useState<string>(application?.final_date)

    const [total_price, setTotal_price] = useState<string>(application?.total_price)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchApplication(id))
        return () => dispatch(removeApplication())
    }, []);

    useEffect(() => {
        setStart_date(application?.start_date)
        setFinal_date(application?.final_date)
        setTotal_price(application?.total_price)
    }, [application]);

    const sendApplication = async (e) => {
        e.preventDefault()

        await saveApplication()

        await dispatch(sendDraftApplication())

        navigate("/applications/")
    }

    const saveApplication = async (e?) => {
        e?.preventDefault()

        const data = {
            start_date,
            final_date
        }

        await dispatch(updateApplication(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteApplication = async () => {
        await dispatch(deleteDraftApplication())
        navigate("/apartments/")
    }

    if (!application) {
        return (
            <div>

            </div>
        )
    }

    const isDraft = application.status == E_ApplicationStatus.Draft
    const isCompleted = application.status == E_ApplicationStatus.Completed

    return (
        <Form onSubmit={sendApplication} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновое заявление" : `Заявление №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomDatePicker label="Введите дату приезда" value={start_date} setValue={setStart_date} disabled={!isDraft}/>
                <CustomDatePicker label="Введите дату выезда" value={final_date} setValue={setFinal_date} disabled={!isDraft}/>
                {isCompleted && <CustomInput label="Итоговая цена (руб.)" value={total_price} disabled={true}/>}
            </Row>
            <Row>
                {application.apartments.length > 0 ? application.apartments.map((apartment:T_Apartment) => (
                    <Row key={apartment.id} className="d-flex justify-content-center mb-5">
                        <ApartmentCard apartment={apartment} showRemoveBtn={isDraft} editMM={isDraft} />
                    </Row>
                )) :
                    <h3 className="text-center">Апартаменты не добавлены</h3>
                }
            </Row>
            {isDraft &&
                <Row className="mt-5">
                    <Col className="d-flex gap-3 justify-content-center">
                        <Button color="success"  onClick={saveApplication}>Сохранить</Button>
                        <Button color="primary"  type="submit">Отправить</Button>
                        <Button color="danger"  onClick={deleteApplication}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};
// fs-4
// gap-5
export default ApplicationPage