import {useAppDispatch, useAppSelector} from "store/store.ts";
import {Button, CardText, Form} from "reactstrap";
import { FormEvent, useState, useEffect } from 'react'
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {handleUpdateProfile} from "store/slices/userSlice.ts";
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {

    const {username} = useAppSelector((state) => state.user)

    const [inputPassword, setInputPassword] = useState("")

    const isAuthenticated = useAppSelector(
			state => state.user?.is_authenticated
		)

    const dispatch = useAppDispatch()

    const handleSaveProfile = async (e:FormEvent) => {
        e.preventDefault()

        const data = {
            password: inputPassword
        }

        dispatch(handleUpdateProfile(data))
    }

    const navigate = useNavigate()

    useEffect(() => {
                if (!isAuthenticated) {
                    navigate('/403/')
                }
            }, [isAuthenticated])

    return (
        <Form onSubmit={handleSaveProfile} className="w-25">
            <CardText>Логин: {username}</CardText>
            <CustomInput label="Сбросить пароль" placeholder="Введите новый пароль" value={inputPassword} setValue={setInputPassword} errorText={"Введены некорректные данные"} required={true} />
            <Button type="submit" color="primary" className="mt-3">Сохранить</Button>
        </Form>
    )
}

export default ProfilePage