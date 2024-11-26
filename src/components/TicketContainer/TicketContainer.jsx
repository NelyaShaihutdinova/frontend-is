import Header from "../Header/Header.jsx";
import './TicketContainer.css';
import TicketPage from "../TicketPage/TicketPage.jsx";

export default function TicketContainer() {
    return (
        <>
            <div className="main">
                <Header/>
                <TicketPage/>
            </div>
        </>
    )
}