import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Apartment} from "modules/types.ts";

interface ApartmentCardProps {
    apartment: T_Apartment,
    isMock: boolean
}

const ApartmentCard = ({apartment, isMock}: ApartmentCardProps) => {
    return (
        <Card key={apartment.id} style={{width: '18rem', margin: "0 auto 50px" }}>
            <CardImg
                src={isMock ? mockImage as string : apartment.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {apartment.name}
                </CardTitle>
                <CardText>
                    Цена: {apartment.price} руб.
                </CardText>
                <Link to={`/apartments/${apartment.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default ApartmentCard