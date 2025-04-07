import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      document.title = "Time Bank | Bejelentkezés";
    
    }, [])
    
    const handleLogin = async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        try {
            // Step 1: Fetch salt from API
            const saltResponse = await axios.post(`${process.env.REACT_APP_URL}/api/Login/GetSalt/${username}`);

            const salt = saltResponse.data;

            // Step 2: Hash the password with the salt on the frontend
            const tmpHash = CryptoJS.SHA256(password + salt).toString();

            // Step 3: Send the hashed password to the backend
            const loginResponse = await axios.post(`${process.env.REACT_APP_URL}/api/Login`, {
                    loginName: username,
                    tmpHash: tmpHash,
                });

            if (loginResponse.status === 200) {
                const token = loginResponse.data.token;
                const username = loginResponse.data.felhasznaloNev;
                const userID = loginResponse.data.userID;
                const timeBalance = loginResponse.data.timeBalance
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                localStorage.setItem("userID", userID);
                localStorage.setItem("timeBalance", timeBalance);
                alert('Login successful!');
                console.log('Logged-in user:', loginResponse.data);

                navigate('/Services');
            } else {
                alert('Invalid username or password!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred while logging in.');
        }
    };

    return (
        <section className="hero form-card">
            <h2 className='mb-4 '>Bejelentkezés</h2>
            <i className="bi bi-person-fill me-3"></i>
            <input className='mb-2' type="string" placeholder="Felhasználónév" id="username" />
            <br />
            <i className="bi bi-key-fill me-3"></i>
            <input className='mb-2' type="password" placeholder="Jelszó" id="password" />
            <br />
            <button className="btn btn-primary mb-1" onClick={handleLogin}>Bejelentkezés</button>
            <p>Még nincs fiókod?
                <a href="/RegistrationPage">Regisztráció</a></p>
            <Link to="/">
                <button className="btn btn-secondary" >
                    Vissza a kezdőlapra
                </button>
            </Link>
        </section>
    );
};

export default LoginPage;