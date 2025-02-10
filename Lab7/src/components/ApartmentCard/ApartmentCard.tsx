import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {T_Apartment} from "modules/types.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addApartmentToApplication, fetchApartments} from "store/slices/apartmentsSlice.ts";
import {removeApartmentFromDraftApplication, updateApartmentValue} from "store/slices/applicationsSlice.ts";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";
import './index.css'

type Props = {
    apartment: T_Apartment,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean,
}

const ApartmentCard = ({apartment,  showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {save_mm} = useAppSelector(state => state.applications)

    const [local_wishes, setLocal_wishes] = useState(apartment.wishes)
    
    const location = useLocation()

    const isApplicationPage = location.pathname.includes("applications")

    const handeAddToDraftApplication = async () => {
        await dispatch(addApartmentToApplication(apartment.id))
        await dispatch(fetchApartments())
    }

    const handleRemoveFromDraftApplication = async () => {
        await dispatch(removeApartmentFromDraftApplication(apartment.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateApartmentValue({
            apartment_id: apartment.id,
            wishes: local_wishes
        }))
    }

    if (isApplicationPage) {
        return (
            <Card key={apartment.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            className="image-off"
                            src={apartment.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {apartment.name}
                            </CardTitle>
                            <CardText>
                                Цена: {apartment.price} руб.
                            </CardText>
                            <CustomTextarea label="Введите пожелания" type="number" value={local_wishes} setValue={setLocal_wishes} disabled={!editMM || is_superuser} className={"w-25"}/>
                            <Col className="d-flex gap-5">
                                <Link to={`/apartments/${apartment.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftApplication}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
			<Card key={apartment.id} className='custom-card '>
				<div className='image-container'>
					<Col>
						<img
							alt=''
							className='image'
							src={
								apartment.image ||
								'http://localhost:9000/buckets/images/default_.png'
							}
						/>
					</Col>
					<div className='text-overlay'>
						<p className='text_header'>{apartment.name}</p>
						<div className='button_line '>
							<Col className='d-flex justify-content-between '>
								<Link to={`/apartments/${apartment.id}`}>
									<Button color='primary' type='button'>
										Открыть
									</Button>
								</Link>
								{showAddBtn && (
									<Button
										color='secondary'
										onClick={handeAddToDraftApplication}
									>
										Добавить
									</Button>
								)}
							</Col>
						</div>
					</div>
				</div>
			</Card>
		)
};

export default ApartmentCard