import MainContainer from "./components/MainContainer/MainContainer.jsx";
import ProtectedRoute from "./components/utils/ProtectedRoute.jsx";
import {Route, Routes} from "react-router-dom";
import OrderForm from "./components/OrderForm/OrderForm.jsx";
import TicketPage from "./components/pages/TicketPage.jsx";
import CoordinatesPage from "./components/pages/CoordinatesPage.jsx";
import EventPage from "./components/pages/EventPage.jsx";
import VenuePage from "./components/pages/VenuePage.jsx";
import LocationPage from "./components/pages/LocationPage.jsx";
import PersonPage from "./components/pages/PersonPage.jsx";
import AdminPage from "./components/pages/AdminPage.jsx";
import ImportPage from "./components/pages/ImportPage.jsx";

function App() {

    return (
        <Routes>
            <Route path="/" element={<OrderForm/>}/>
            <Route path="/entity" element={<ProtectedRoute><MainContainer><TicketPage/></MainContainer></ProtectedRoute>}/>
            <Route path="/coordinates" element={<ProtectedRoute><MainContainer><CoordinatesPage/></MainContainer></ProtectedRoute>}/>
            <Route path="/event" element={<ProtectedRoute><MainContainer><EventPage/></MainContainer></ProtectedRoute>}/>
            <Route path="/venue" element={<ProtectedRoute><MainContainer><VenuePage/></MainContainer></ProtectedRoute>}/>
            <Route path="/location" element={<ProtectedRoute><MainContainer><LocationPage/></MainContainer></ProtectedRoute>}/>
            <Route path="/person" element={<ProtectedRoute><MainContainer><PersonPage/></MainContainer></ProtectedRoute>}/>
            <Route path="/admin" element={<ProtectedRoute><MainContainer><AdminPage/></MainContainer></ProtectedRoute>}/>
            <Route path="/import" element={<ProtectedRoute><MainContainer><ImportPage/></MainContainer></ProtectedRoute>}/>
        </Routes>
    )
}

export default App
