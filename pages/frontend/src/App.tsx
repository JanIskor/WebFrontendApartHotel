import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import ApartmentPage from "pages/ApartmentPage/ApartmentPage.tsx";
import ApartmentsListPage from "pages/ApartmentsListPage/ApartmentsListPage.tsx";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage/HomePage.tsx";
import {useState} from "react";
import {T_Apartment} from "modules/types.ts";

function App() {

    const [apartments, setApartments] = useState<T_Apartment[]>([])

    const [selectedApartment, setSelectedApartment] = useState<T_Apartment | null>(null)

    const [isMock, setIsMock] = useState(false);

    return (
        <>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedApartment={selectedApartment}/>
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/apartments/" element={<ApartmentsListPage apartments={apartments} setApartments={setApartments} isMock={isMock} setIsMock={setIsMock} />} />
                        <Route path="/apartments/:id" element={<ApartmentPage selectedApartment={selectedApartment} setSelectedApartment={setSelectedApartment} isMock={isMock} setIsMock={setIsMock} />} />
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default App
