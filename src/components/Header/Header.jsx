import './Header.css';
import {Link} from "react-router-dom";
import {clearToken} from "../api.js";
export default function Header() {
    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <img src="../../../public/images/free-icon-ticket-390134.png" alt="logo"/>
                    </div>
                    <nav className="menu">
                        <ul className="menu-list">
                            <li className="menu-item">
                                <Link to="/entity">Tickets</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/coordinates">Coordinates</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/person">Person</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/venue">Venue</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/event">Event</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/location">Location</Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/" onClick={clearToken}>Logout</Link>
                            </li>
                            {(localStorage.getItem("role") == "ADMIN") ? (
                                <li className="menu-item">
                                    <Link to="/admin">Admin requests</Link>
                                </li>
                            ) : (<li></li>)}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}