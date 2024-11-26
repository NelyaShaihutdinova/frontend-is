import Header from "../Header/Header.jsx";
import '../TicketContainer/TicketContainer.css';
import AdminPage from "./AdminPage.jsx";

export default function AdminContainer() {
    return (
        <>
            <div className="main">
                <Header/>
                <AdminPage/>
            </div>
        </>
    )
}