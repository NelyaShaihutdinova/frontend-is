import Header from "../Header/Header.jsx";
import './UserContainer.css';
import ShowTableContainer from "../ShowTableContainer/ShowTableContainer.jsx";

export default function UserContainer() {
    return (
        <>
            <div className="main">
                <Header />
                <ShowTableContainer/>
            </div>
        </>
    )
}