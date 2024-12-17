import FormContainer from "./components/FormContainer/FormContainer.jsx";
import TicketContainer from "./components/TicketContainer/TicketContainer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {Route, Routes} from "react-router-dom";
import CoordinatesContainer from "./components/CoordinatesPage/CoordinatesContainer.jsx";
import EventContainer from "./components/EventPage/EventContainer.jsx";
import VenueContainer from "./components/VenuePage/VenueContainer.jsx";
import LocationContainer from "./components/LocationPage/LocationContainer.jsx";
import PersonContainer from "./components/PersonPage/PersonContainer.jsx";
import AdminContainer from "./components/AdminPage/AdminContainer.jsx";
import ImportContainer from "./components/ImportPage/ImportContainer.jsx";

function App() {

    return (
        <Routes>
            <Route path="/" element={<FormContainer/>}/>
            <Route path="/entity" element={<ProtectedRoute><TicketContainer/></ProtectedRoute>}/>
            <Route path="/coordinates" element={<ProtectedRoute><CoordinatesContainer/></ProtectedRoute>}/>
            <Route path="/event" element={<ProtectedRoute><EventContainer/></ProtectedRoute>}/>
            <Route path="/venue" element={<ProtectedRoute><VenueContainer/></ProtectedRoute>}/>
            <Route path="/location" element={<ProtectedRoute><LocationContainer/></ProtectedRoute>}/>
            <Route path="/person" element={<ProtectedRoute><PersonContainer/></ProtectedRoute>}/>
            <Route path="/admin" element={<ProtectedRoute><AdminContainer/></ProtectedRoute>}/>
            <Route path="/import" element={<ProtectedRoute><ImportContainer/></ProtectedRoute>}/>
        </Routes>
    )
}

export default App
