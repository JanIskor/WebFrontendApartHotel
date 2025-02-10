

import * as React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from 'store/store.ts'

const Breadcrumbs = () => {
	const location = useLocation()

	const apartment = useAppSelector(state => state.apartments.apartment)

	const application = useAppSelector(state => state.applications.application)

	const { is_superuser } = useAppSelector(state => state.user)

	const crumbs = () => {
		if (location.pathname == '/') {
			return (
				<>
					<BreadcrumbItem>
						<Link to='/'>Главная</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/apartments/') {
			return (
				<>
					<BreadcrumbItem>
						<Link to={location.pathname}> Апартаменты</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/apartments-table/') {
			return (
				<>
					<BreadcrumbItem>
						<Link to={location.pathname}>Таблица апартаментов</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/apartments/add') {
			return (
				<>
					<BreadcrumbItem>
						<Link to={is_superuser ? '/apartments-table/' : '/apartments/'}>
							Апартаменты
						</Link>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Link to={location.pathname}>Добавление апартаментов</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (apartment) {
			return (
				<>
					<BreadcrumbItem>
						<Link to={is_superuser ? '/apartments-table/' : '/apartments/'}>
							Апартаменты
						</Link>
					</BreadcrumbItem>
					<BreadcrumbItem active>
						<Link to={location.pathname}>{apartment.name}</Link>
					</BreadcrumbItem>
				</>
			)
		}

		if (application) {
			return (
				<>
					<BreadcrumbItem active>
						<Link to='/applications/'>Заявления</Link>
					</BreadcrumbItem>
					<BreadcrumbItem active>
						<Link to={location.pathname}>Заявление №{application?.id}</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/applications/') {
			return (
				<>
					<BreadcrumbItem active>
						<Link to={location.pathname}>Заявления</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/login/') {
			return (
				<>
					<BreadcrumbItem active>
						<Link to={location.pathname}>Вход</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/register/') {
			return (
				<>
					<BreadcrumbItem active>
						<Link to={location.pathname}>Регистрация</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		if (location.pathname == '/profile/') {
			return (
				<>
					<BreadcrumbItem>
						<Link to='/profile/'>Личный кабинет</Link>
					</BreadcrumbItem>
					<BreadcrumbItem></BreadcrumbItem>
				</>
			)
		}

		return (
			<>
				<BreadcrumbItem>
					<Link to='/'>Главная</Link>
				</BreadcrumbItem>
				<BreadcrumbItem></BreadcrumbItem>
			</>
		)
	}

	return <Breadcrumb className='fs-5'>{crumbs()}</Breadcrumb>
}

export default Breadcrumbs