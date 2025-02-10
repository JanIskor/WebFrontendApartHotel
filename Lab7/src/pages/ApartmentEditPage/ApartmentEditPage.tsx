import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteApartment,
    fetchApartment,
    removeSelectedApartment,
    updateApartment,
    updateApartmentImage
} from "store/slices/apartmentsSlice.ts";
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const ApartmentEditPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {apartment} = useAppSelector((state) => state.apartments)

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>(apartment?.name)

    const [description, setDescription] = useState<string>(apartment?.description)

    const [price, setPrice] = useState<number>(apartment?.price)

    // const [material, setMaterial] = useState<string>(apartment?.material)

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState<string>(apartment?.image)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const saveApartment = async() => {
        if (imgFile) {
            const form_data = new FormData()
            form_data.append('image', imgFile, imgFile.name)
            await dispatch(updateApartmentImage({
                apartment_id: apartment.id,
                data: form_data
            }))
        }

        const data = {
            name,
            description,
            price,
        }

        await dispatch(updateApartment({
            apartment_id: apartment.id,
            data
        }))

        navigate("/apartments-table/")
    }

    useEffect(() => {
        dispatch(fetchApartment(id))
        return () => dispatch(removeSelectedApartment())
    }, []);

    useEffect(() => {
        setName(apartment?.name)
        setDescription(apartment?.description)
        setPrice(apartment?.price)
        setImgURL(apartment?.image)
    }, [apartment]);

    const handleDeleteApartment = async () => {
        await dispatch(deleteApartment(id))
        navigate("/apartments-table/")
    }

    if (!apartment) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName}/>
                    <CustomTextarea label="Описание" placeholder="Введите описание" value={description} setValue={setDescription}/>
                    <CustomInput type="number" label="Цена" placeholder="Введите цену" value={price} setValue={setPrice}/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={saveApartment}>Сохранить</Button>
                        <Button color="danger" className="fs-4" onClick={handleDeleteApartment}>Удалить</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default ApartmentEditPage