import {Link} from "react-router-dom";
import {Badge, Button} from "reactstrap";

type Props = {
    isActive: boolean,
    draft_application_id: string,
    apartments_count: number
}

const Bin = ({isActive, draft_application_id, apartments_count}:Props) => {

    if (!isActive) {
        return <Button color={"secondary"} className="bin-wrapper" disabled>Корзина</Button>
    }

    return (
        <Link to={`/applications/${draft_application_id}/`} className="bin-wrapper">
            <Button color={"primary"} className="w-100 bin">
                Корзина
                <Badge>
                    {apartments_count}
                </Badge>
            </Button>
        </Link>
    )
}

export default Bin