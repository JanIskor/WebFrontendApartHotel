import { FC } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header/Header'
import Carousel from './components/Slider'

import './index.css'

const HomePage: FC = () => {
    return (
			<>
				<Header />
				<div className='welcome'>
					<Carousel />
				</div>
			</>
		)
};

export default HomePage