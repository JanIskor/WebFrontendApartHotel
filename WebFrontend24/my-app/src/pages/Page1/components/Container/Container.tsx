import './index.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FC } from 'react'
import { ROUTES, ROUTE_LABELS } from "../../../../Routes";

interface Apartment {
	id: number
	name: string
	description: string
	image: string
	price: number
	details: string
}

interface Props {
    Apartment: Apartment[];
    navigate: (path: string) => void; // Add navigate to Props
}

const Container: FC<Props> = ({ Apartment , navigate}) => {
    const handleCardClick = (id: number) => {
        // клик на карточку, переход на страницу альбома
        navigate(`${ROUTES.APARTMENTS}/${id}`);
        console.log(id);
      };
    return (
			<>
				{Apartment.map((apartment, index) => (
					<Card key={index} className='custom-card '>
						<div className='image-container'>
							<Card.Img
								variant='top'
								className='image'
								src={apartment.image || 'http://localhost:9000/test/default_.png'}
								
							/>
							<div className='text-overlay'>
								<p className='text_header'>{apartment.name}</p>
								<p className='text_description'>{apartment.description}</p>
								<div className='button_line'>
									<button
										className='rectangle_6'
										onClick={() => handleCardClick(apartment.id)}
									>
										<span className='text_button'>Подробнее</span>
									</button>
								</div>
							</div>
						</div>
					</Card>
				))}
			</>
		)
}

export default Container