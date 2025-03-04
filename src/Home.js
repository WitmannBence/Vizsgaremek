import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';


const Home = () => {

const token = localStorage.getItem("token")
document.title = "Time Bank"

    return (

        <div className="mainBackground">
                <div className="hero full-screen">
                    <h1><img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Logo" style={{ width: '190px', height: '190px',  margin: '10px !important'}}/></h1>
                    <h2><strong>Üdvözlünk a Time Bank weboldalán!</strong></h2>
                    <div className="feature-cards">
                        <div className="card">
                            <span>🌐</span>
                            <h3>Kérj segítséget!</h3>
                            <p>Böngéssz felhasználóink által közre tett szolgáltatások közül!</p>
                        </div>
                        <div className="card">
                            <span>⭐</span>
                            <h3>Válaszd ki érdeklődéseidet!</h3>
                            <p>Választhatsz érdeklődési körökből, hogy könnyebben megtaláld amit szeretnél.</p>
                        </div>
                        <div className="card">
                            <span>🔁</span>
                            <h3>Szerezz pontokat!</h3>
                            <p>Minden felhasználó segíthet másoknak, hogy ingyen hozzáférhessenek.</p>
                        </div>
                    </div>
                    {!token ? ( // Show login/register buttons if token does NOT exist
  <>
    <Link to="/LoginPage">
      <button className="cta-button">Bejelentkezés</button>
    </Link>
    <Link to="/RegistrationPage">
      <button className="cta-button">Regisztrálok</button>
    </Link>
  </>
) : ( // Show new button if token EXISTS
  <Link to= "/Services">
    <button className="cta-button">Szolgáltatások</button> 
  </Link>
)}
                </div>
        </div>
    );
};

export default Home;
