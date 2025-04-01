import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';


const Home = () => {

const token = localStorage.getItem("token")
document.title = "Time Bank"

    return (

        <div className="mainBackground" style={{}}>
                <div className="hero full-screen">
                    <h1><img src={`${process.env.PUBLIC_URL}/favicon.ico`} draggable="false" alt="Logo" style={{ width: '150px', height: '150px',  margin: '10px !important'}}/></h1>
                    <h2><strong>Üdvözlünk a Time Bank weboldalán!</strong></h2>
                    <div className="feature-cards ">
                        <div className="card" style={{width:"300px"}}>
                            <span>🌐</span>
                            <h4>Kérj segítséget!</h4>
                            <p>Böngéssz felhasználóink által közre tett szolgáltatások közül!</p>
                        </div>
                        <div className="card" style={{width:"300px"}}>
                            <span>⭐</span>
                            <h4>Válaszd ki érdeklődéseidet!</h4>
                            <p>Választhatsz érdeklődési körökből, hogy könnyebben megtaláld amit szeretnél.</p>
                        </div>
                        <div className="card" style={{width:"300px"}}>
                            <span>🔁</span>
                            <h4>Szerezz pontokat!</h4>
                            <p>Minden felhasználó segíthet másoknak, hogy ingyen hozzáférhessenek.</p>
                        </div>
                    </div>
                    {!token ? ( // Show login/register buttons if token does NOT exist
  <>
    <Link to="/LoginPage">
      <button className="cta-button mb-3" style={{width:"150px"}}>Bejelentkezés</button>
    </Link>
    <Link to="/RegistrationPage">
      <button className="cta-button mt-1 mb-5"style={{width:"150px"}}>Regisztrálok </button>
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
