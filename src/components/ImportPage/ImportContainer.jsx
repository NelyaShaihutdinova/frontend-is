import Header from "../Header/Header.jsx";
import '../TicketContainer/TicketContainer.css';
import ImportPage from "./ImportPage.jsx";

export default function ImportContainer() {
    return (
        <>
            <div className="main">
                <Header/>
                <ImportPage/>
            </div>
        </>
    )
}