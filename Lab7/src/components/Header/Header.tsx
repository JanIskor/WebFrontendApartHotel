

import {
	Col,
	Collapse,
	Container,
	Nav,
	Navbar,
	NavbarBrand,
	NavbarToggler,
	NavItem,
	NavLink,
} from 'reactstrap'
import { NavLink as RRNavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/store.ts'
import { useState } from 'react'
import { handleLogout } from 'store/slices/userSlice.ts'
import '../Header/Header.css'

const Header = () => {
	const dispatch = useAppDispatch()

	const { is_authenticated, is_superuser } = useAppSelector(state => state.user)

	const username = useAppSelector(state => state.user.username)

	const navigate = useNavigate()

	const logout = async e => {
		e.preventDefault()
		await dispatch(handleLogout())
		navigate('/')
	}

	const [collapsed, setCollapsed] = useState(true)

	const toggleNavbar = () => setCollapsed(!collapsed)

	const hideMenu = () => setCollapsed(true)

	return (
		<header>
			<Navbar className='p-3 border' expand='lg'>
				<Container className='p-0'>
					<Navbar collapseOnSelect expand='lg'>
						<Col className='d-flex align-items-center'>
							<NavbarBrand>
								<NavLink tag={RRNavLink} to='/'>
									<div className='apartment_label'>
										<div className='apartment_title2'>
											<p>MARRIOT</p>
										</div>
									</div>
								</NavLink>
							</NavbarBrand>
						</Col>
						<NavbarToggler
							aria-controls='responsive-navbar-nav'
							onClick={toggleNavbar}
						/>
						<Collapse id='responsive-navbar-nav' navbar isOpen={!collapsed}>
							<Nav
								className='mr-auto fs-5 d-flex flex-grow-1 justify-content-end align-items-center'
								onClick={hideMenu}
								navbar
							>
								<NavItem>
									<NavLink tag={RRNavLink} to={'/apartments/'}>
										Апартаменты
									</NavLink>
								</NavItem>
								{is_authenticated ? (
									<>
										{is_superuser && (
											<NavItem>
												<NavLink tag={RRNavLink} to={'/apartments-table/'}>
													Таблица апартаментов
												</NavLink>
											</NavItem>
										)}
										<NavItem>
											<NavLink tag={RRNavLink} to='/applications/'>
												Заявления
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink tag={RRNavLink} to='/profile/'>
												{username}
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink style={{ cursor: 'pointer' }} onClick={logout}>
												Выйти
											</NavLink>
										</NavItem>
									</>
								) : (
									<>
										<NavItem>
											<NavLink tag={RRNavLink} to='/login/'>
												Войти
											</NavLink>
										</NavItem>
										<NavItem>
											<NavLink tag={RRNavLink} to='/register/'>
												Зарегистрироваться
											</NavLink>
										</NavItem>
									</>
								)}
							</Nav>
						</Collapse>
					</Navbar>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header