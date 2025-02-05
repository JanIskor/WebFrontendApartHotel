import './index.css';
import { useEffect, useState} from 'react';
import Header from '../components/Header'
import { useParams } from "react-router-dom"
import {Apartment, getApartmentById} from '../modules/Api';
import { ROUTES, ROUTE_LABELS } from "../../Routes";
import BreadCrumbs from "../components/BreadCrumbs";
import { APARTMENTS_MOCK } from '../modules/mock'

function Page2() {
  const [Apartment, setApartment] = useState<Apartment | null>(null);
  const { id } = useParams(); // ид страницы, пример: "/albums/12"
  
  useEffect(() => {
    if (!id) return;
    document.body.style.background = 'white';
    getApartmentById(id)
      .then((response) => setApartment(response))
      .catch((error) => {
				console.error('Error fetching apartment data:', error)
				// Optionally handle the error state here
				// Ищем элемент с данным ID в моке
				const mockElement = APARTMENTS_MOCK.services.find(
					element => element.id === Number(id)
				)

				// Если элемент найден в моках, устанавливаем его как данные страницы
				if (mockElement) {
					setApartment(mockElement)
				}
			});
    // Set the body background color when this component mounts
    // Reset the body background color when this component unmounts
    return () => {
      document.body.style.background = ''; // Reset to default
    };
  }, [id]);

  
  if (!Apartment) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
		<>
			<Header />
			<BreadCrumbs
				crumbs={[
					{ label: ROUTE_LABELS.APARTMENTS, path: ROUTES.APARTMENTS },
					{ label: Apartment?.name || 'Апартаменты' },
				]}
			/>
			<p className='apartment_type'>{Apartment.name}</p>
			<div className='custom-container2'>
				<div className='upper-part'>
					<div className='apartment_name'>
						{/* <p className="visa-word">виза</p> */}
						<img
							src={Apartment.image || 'http://localhost:9000/test/default_.png'}
							alt='картинка к апартам'
							className='image2'
						/>
					</div>
					<div className='documents-box'>
						<span className='main_description'>{Apartment.details}</span>
						<span className='title_description' id='apartments.id'>
							{Apartment.description}
						</span>
						<span className='price'>{Apartment.price}₽</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default Page2