import Header from "../Header/Header.jsx";
import '../TicketContainer/TicketContainer.css';
import LocationPage from "./LocationPage.jsx";

export default function LocationContainer() {
    return (
        <>
            <div className="main">
                <Header/>
                <LocationPage/>
            </div>
        </>
    )
}