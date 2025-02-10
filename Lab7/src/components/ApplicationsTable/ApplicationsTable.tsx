import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {formatDate} from "src/utils/utils.ts";
import {T_Application} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import { Button } from 'reactstrap'
import { api } from 'modules/api.ts'
import {  useAppSelector } from 'store/store.ts'

const ApplicationsTable = ({applications}:{applications:T_Application[]}) => {
    const navigate = useNavigate()

		const { is_superuser } = useAppSelector(state => state.user)

    const handleClick = (application_id) => {
        navigate(`/applications/${application_id}`)
    }

  const handleApprove = (applicationId: string) => {
		const confirmApprove = window.confirm(
			'Вы уверены, что хотите одобрить эту заявку?'
		)
		if (confirmApprove) {
			api.applications
				.applicationsUpdateStatusAdminUpdate(applicationId, {
					status: 3,
				})
				.then(response => {
					console.log('Статус обновлен успешно:', response.data)
				})
				.catch(error => {
					console.error('Ошибка при обновлении статуса:', error)
				})
		}
	}

	const handleReject = (applicationId: string) => {
		const confirmReject = window.confirm(
			'Вы уверены, что хотите отклонить эту заявку?'
		)
		if (confirmReject) {
			api.applications
				.applicationsUpdateStatusAdminUpdate(applicationId, {
					status: 4,
				})
				.then(response => {
					console.log('Статус обновлен успешно:', response.data)
				})
				.catch(error => {
					console.error('Ошибка при обновлении статуса:', error)
				})
		}
	}

    const STATUSES = {
        1: "Введен",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    const columns = useMemo(
			() => {
				const baseColumns = [

				{
					Header: '№',
					accessor: 'id',
				},
				{
					Header: 'Статус',
					accessor: 'status',
					Cell: ({ value }) => STATUSES[value],
				},
				{
					Header: 'Итоговая цена',
					accessor: 'total_price',
					Cell: ({ value }) => value,
				},
				// {
				// 	Header: 'Дата создания',
				// 	accessor: 'date_created',
				// 	Cell: ({ value }) => formatDate(value),
				// },
				{
					Header: 'Дата формирования',
					accessor: 'date_formation',
					Cell: ({ value }) => formatDate(value),
				},
				{
					Header: 'Дата завершения',
					accessor: 'date_complete',
					Cell: ({ value }) => formatDate(value),
				},
			];
                

				  if (is_superuser) {
    			baseColumns.push({
						Header: 'Подтверждение',
						accessor: 'edit_button',
						Cell: ({ cell }) => (
							<Button 
								color='success' 
								onClick={() => handleApprove(cell.row.values.id)} 
							>
								Одобрить 
							</Button>
      ),
    });
  }
					  if (is_superuser) {
    			baseColumns.push({
					Header: 'Отклонение',
					accessor: 'delete_button',
					Cell: ({ cell }) => (
						<Button
							color='danger'
							onClick={() => handleReject(cell.row.values.id)}
						>
							Отклонить
						</Button>
      ),
    });
  }
  		return baseColumns; // Возвращаем массив колонок
			}, [is_superuser]); // Зависимость для обновления при изменении is_superuser

    return (
        <CustomTable columns={columns} data={applications} onClick={handleClick}/>
    );
	}
export default ApplicationsTable