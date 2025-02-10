import { useNavigate, useParams } from 'react-router-dom'
import {useMemo} from "react";
import {Button} from "reactstrap";
import {T_Apartment} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {deleteApartment} from "store/slices/apartmentsSlice.ts";
import {useAppDispatch} from "store/store.ts";

type Props = {
    apartments:T_Apartment[]
}

const ApartmentsTable = ({apartments}:Props) => {

    const { id } = useParams<{ id: string }>()

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (apartment_id) => {
        navigate(`/apartments/${apartment_id}`)
    }

    const openApartmentEditPage = (apartment_id) => {
        navigate(`/apartments/${apartment_id}/edit`)
    }

    const handleDeleteApartment = async (apartment_id) => {
        dispatch(deleteApartment(apartment_id))
    }

    const handleDeleteClick = async () => {
			await dispatch(deleteApartment(id))
		}

    // const handleDeleteClick = (id: number) => {
    //         const confirmDelete = window.confirm(
    //             'Вы уверены, что хотите удалить этот элемент? Данное действие нельзя отменить.'
    //         )
    //         if (confirmDelete) {
    //             dispatch(deleteApartment(id.toString()) as any)
    //         }
    //     }

    const columns = useMemo(
			() => [
				{
					Header: '№',
					accessor: 'id',
				},
				{
					Header: 'Фото',
					accessor: 'image',
					Cell: ({ value }) => <img src={value} width={100} />,
				},
				{
					Header: 'Название',
					accessor: 'name',
					Cell: ({ value }) => value,
				},
				{
					Header: 'Цена',
					accessor: 'price',
					Cell: ({ value }) => value,
				},
				{
					Header: 'Действие',
					accessor: 'edit_button',
					Cell: ({ cell }) => (
						<Button
							color='primary'
							onClick={() => openApartmentEditPage(cell.row.values.id)}
						>
							Редактировать
						</Button>
					),
				},
			],
			[]
		)

    if (!apartments.length) {
        return (
            <></>
        )
    }

    return (
        <CustomTable columns={columns} data={apartments} onClick={handleClick} />
    )
};

export default ApartmentsTable