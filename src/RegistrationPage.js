import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    felhasznaloNev: "",
    teljesNev: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate a random salt
  const generateSalt = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  // Hash the password with salt
  const hashPassword = async (password, salt) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const salt = generateSalt();
      const hash = await hashPassword(formData.password, salt);

      const user = {
        userId: 0,
        felhasznaloNev: formData.felhasznaloNev,
        teljesNev: formData.teljesNev,
        salt: salt,
        hash: hash,
        email: formData.email,
        jogosultsag: 0,
        aktiv: 0, // User is inactive until email verification
        regisztracioDatuma: new Date().toISOString(),
        profilKepUtvonal: "",
        timeBalance: 0,
      };

      const response = await fetch("http://localhost:5293/api/User/Registry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        let errorMessage = "Hálózati hiba történt";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setSuccess("Regisztráció sikeres! Kérjük, erősítsd meg az emailed.");
      setTimeout(() => navigate("/LoginPage"), 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Hiba történt a regisztráció során. Kérjük, próbálja újra.");
    }
  };

  return (
    <section className="hero form-card">
      <h2 className="mb-4">Regisztráció</h2>
      <form onSubmit={handleSubmit}>
      <i className="bi bi-person-fill me-3"></i>
        <input className="mb-2"
          type="text"
          name="felhasznaloNev"
          placeholder="Felhasználónév"
          value={formData.felhasznaloNev}
          onChange={handleChange}
          required
        />
        <br />
        <i className="bi bi-person-fill me-3"></i>
        <input className="mb-2"
          type="text"
          name="teljesNev"
          placeholder="Teljes név"
          value={formData.teljesNev}
          onChange={handleChange}
          required
        />
        <br />
        <i class="bi bi-envelope-fill me-3"></i>
        <input className="mb-2"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <i class="bi bi-key-fill me-3"></i>
        <input className="mb-2"
          type="password"
          name="password"
          placeholder="Jelszó"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" className="form-button mb-1 btn btn-primary">
          Regisztráció
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <p>
        Már van fiókod? <Link to="/LoginPage">Bejelentkezés</Link>
      </p>
      <Link to="/">
        <button className="btn btn-secondary">Vissza a kezdőlapra</button>
      </Link>
    </section>
  );
};

export default RegistrationPage;
