import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            // Step 1: Fetch salt from API
            const saltResponse = await fetch(`http://localhost:5293/api/Login/GetSalt/${username}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!saltResponse.ok) {
                alert('User not found!');
                return;
            }

            const salt = await saltResponse.text();

            // Step 2: Hash the password with the salt on the frontend
            const tmpHash = CryptoJS.SHA256(password + salt).toString();
            console.log(tmpHash);

            // Step 3: Send the hashed password to the backend
            const loginResponse = await fetch('http://localhost:5293/api/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loginName: username,
                    tmpHash: tmpHash,
                }),
            });

            if (loginResponse.ok) {
                const loggedInUser = await loginResponse.json();
                const token = loggedInUser.token; // Or whatever the token is called in the response
                const username = loggedInUser.felhasznaloNev;
                const userID = loggedInUser.userID;
                localStorage.setItem("token", token); // Store the token
                localStorage.setItem("username",username );
                localStorage.setItem("userID", userID);
                alert('Login successful!');
                console.log('Logged-in user:', loggedInUser);


                // Redirect to home or dashboard
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
        <section className="hero full-screen">
            <h2>Bejelentkezés</h2>
            <input type="string" placeholder="Felhasználónév" id="username"/>
            <br/>
            <input type="password" placeholder="Jelszó" id="password"/>
            <br/>
            <button className="form-button" onClick={handleLogin}>Bejelentkezés</button>
            <p>Még nincs fiókod? 
            <a href="/RegistrationPage">Regisztráció</a></p>
            <Link to="/">
            <button className="cta-button" >
                Vissza a kezdőlapra
            </button>
            </Link>
        </section>
    );
};

export default LoginPage;