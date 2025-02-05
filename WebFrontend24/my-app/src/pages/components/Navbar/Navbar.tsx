import Nav from 'react-bootstrap/Nav';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./index.css"
const Navbar = () => {
    const location = useLocation();
    const [activeKey, setActiveKey] = useState('/');
    useEffect(() => {
        setActiveKey(location.pathname);
    }, [location]);
    return (
        <Nav
                className="navbar justify-content-center"
                variant="underline"
                activeKey={activeKey}
            >
                <Nav.Item>
                    <Nav.Link href="/">Главная</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/apartments">Апартаменты</Nav.Link>
                </Nav.Item>
            </Nav>
    );
}

export default Navbar;