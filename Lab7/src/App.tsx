import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import ApartmentsListPage from "pages/ApartmentsListPage/ApartmentsListPage.tsx";
import ApartmentPage from "pages/ApartmentPage/ApartmentPage.tsx";
import ApplicationsPage from "pages/ApplicationsPage/ApplicationsPage.tsx";
import ApplicationPage from "pages/ApplicationPage/ApplicationPage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/apartments/" element={<ApartmentsListPage />} />
                        <Route path="/apartments/:id/" element={<ApartmentPage />} />
                        <Route path="/applications/" element={<ApplicationsPage />} />
                        <Route path="/applications/:id/" element={<ApplicationPage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
