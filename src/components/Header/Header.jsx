import './Header.css';
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
                                <a href="#">show</a>
                            </li>
                            <li className="menu-item">
                                <a href="#">add</a>
                            </li>
                            <li className="menu-item">
                                <a href="#">info</a>
                            </li>
                            <li className="menu-item">
                                <a href="#">update</a>
                            </li>
                            <li className="menu-item">
                                <a href="#">delete</a>
                            </li>
                            <li className="menu-item">
                                <a href="#">special actions</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}