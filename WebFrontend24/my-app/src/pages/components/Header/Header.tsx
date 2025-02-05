import Navbar from '../Navbar'
import '../Header/Header.css'
const Header = () => {
	return (
		<div className='header2'>
			<div className='apartment_label'>
				<a href='/'>
					<img className='apartment_picture' src='/marriott-logo.png' />
				</a>
				<div className='apartment_title2'>
					<p>MARRIOT</p>
				</div>
			</div>
			<div className='navbar-container'>
				<Navbar />
			</div>
		</div>
	)
}

export default Header
