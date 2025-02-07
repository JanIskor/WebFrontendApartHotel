import React, { useEffect, useState } from 'react'
import './Slider.css'

const images = [
	'http://127.0.0.1:9000/hotel/images/1.png',
	'http://127.0.0.1:9000/hotel/images/2.png',
	'http://127.0.0.1:9000/hotel/images/3.png',
]

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0)

	// Автопереключение каждые 10 секунд
	useEffect(() => {
		const interval = setInterval(() => {
			handleNext()
		}, 10000)

		return () => clearInterval(interval)
	}, [currentIndex])

	const handleNext = () => {
		setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
	}

	const handlePrev = () => {
		setCurrentIndex(prevIndex =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		)
	}

	return (
		<div className='carousel'>
			{/* Текст и кнопка поверх карусели */}
			<div className='carousel-overlay'>
				<h1 className='welcome-text'>Добро пожаловать</h1>
				<a href='/tariffs' className='tariff-button'>
					Перейти к тарифам
				</a>
			</div>

			{/* Карусельные изображения */}
			<div className='carousel-container'>
				<div
					className='carousel-slide'
					style={{ transform: `translateX(-${currentIndex * 100}%)` }}
				>
					{images.map((image, index) => (
						<div className='carousel-image' key={index}>
							<img
								src={image}
								alt={`Slide ${index + 1}`}
								onClick={index < currentIndex ? handlePrev : handleNext}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Carousel

