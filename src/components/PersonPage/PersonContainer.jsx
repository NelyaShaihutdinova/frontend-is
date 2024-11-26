import Header from "../Header/Header.jsx";
import '../TicketContainer/TicketContainer.css';
import PersonPage from "./PersonPage.jsx";

export default function PersonContainer() {
    return (
        <>
            <div className="main">
                <Header/>
                <PersonPage/>
            </div>
        </>
    )
}