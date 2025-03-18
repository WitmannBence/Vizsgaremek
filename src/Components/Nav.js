import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

export default function Navbar() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userID = localStorage.getItem("userID");
    const timeBalance = localStorage.getItem("timeBalance")
    const navigate = useNavigate();

    const handleLogout = () => {
        // Handle logout by clearing localStorage and redirecting
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userID");
        localStorage.removeItem("timeBalance")
        window.location.href = "/"
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <img className="ms-4" src={`${process.env.PUBLIC_URL}/favicon.ico`} draggable="false" alt="Logo" style={{ width: '30px', height: '30px'}}/>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item ms-4">
                        <Link to={"/"} className="nav-link">
                            <strong className='fs-4'>Főoldal</strong> <span className="sr-only"></span>
                        </Link>                        
                    </li>
                </ul>

                <ul className="navbar-nav mr-auto">
                    {token && ( // Only render if token exists
                        <li className="nav-item ms-4">
                            <Link to="/Services" className="nav-link">
                              <strong className="fs-4">Szolgáltatások</strong>
                            </Link>
                        </li>
                     )}
                </ul>

                <ul className="navbar-nav mr-auto">
                    {token && ( // Only render if token exists
                        <li className="nav-item ms-4">
                            <Link to="/CreateService" className="nav-link">
                              <strong className="fs-4">Szolgáltatás létrehozása</strong>
                            </Link>
                        </li>
                     )}
                </ul>
 

                {/* Right-aligned section */}
                <ul className="navbar-nav" style={{ marginLeft: "auto", textAlign: "right" }}>
                    {username && (
                        <li className="nav-item username-item" style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                            <a className="nav-link">Szia, {username}!</a>
                            <Link to="/Profile">
                            <i className="bi bi-person-circle" style={{ fontSize: "1.5rem", marginRight: "8px", }}></i>
                            </Link>
                            <a className="nav-link">Egyenleged:  {timeBalance} <i className="bi bi-coin"></i></a>
                            
                        </li>
                    )}

                    {/* Conditional rendering for the logout button */}
                    {token && (
                        <li className="nav-item me-4">
                            <button className="btn btn-danger text-white" onClick={handleLogout}>Kijelentkezés</button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
