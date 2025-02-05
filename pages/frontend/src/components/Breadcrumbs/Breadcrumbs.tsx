import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Apartment} from "modules/types.ts";
import "./styles.css"

type Props = {
    selectedApartment: T_Apartment | null
}

const Breadcrumbs = ({selectedApartment}:Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/apartments") &&
                <BreadcrumbItem active>
                    <Link to="/apartments">
						Апартаменты
                    </Link>
                </BreadcrumbItem>
			}
            {selectedApartment &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedApartment.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs