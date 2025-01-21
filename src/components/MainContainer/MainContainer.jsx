import Header from "../Header/Header.jsx";
import './MainContainer.css';
import PropTypes from "prop-types";
import ProtectedRoute from "../utils/ProtectedRoute.jsx";

export default function MainContainer({children}) {
    return (
        <>
            <div className="main">
                <Header/>
                {children}
            </div>
        </>
    )
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
