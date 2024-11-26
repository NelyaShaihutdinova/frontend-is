import Header from "../Header/Header.jsx";
import '../TicketContainer/TicketContainer.css';
import CoordinatesPage from "./CoordinatesPage.jsx";

export default function CoordinatesContainer() {
    return (
        <>
            <div className="main">
                <Header/>
                <CoordinatesPage/>
            </div>
        </>
    )
}