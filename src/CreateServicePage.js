import { useState } from "react";
import { Link } from "react-router-dom";

const CreateServicePage = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    timeCost: "",
    description: "",
    categoryId: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Nem vagy bejelentkezve");
      return;
    }

    const serviceData = {
      serviceId: 0,
      userId: 0, // The backend assigns this automatically
      serviceName: formData.serviceName,
      timeCost: parseInt(formData.timeCost, 10),
      description: formData.description,
      createdAt: new Date().toISOString(),
      categoryId: parseInt(formData.categoryId, 10),
      category: null,
      userServices: []
    };

    try {
      const response = await fetch(
        `http://localhost:5293/api/Service?uId=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(serviceData)
        }
      );

      const data = await response.text();

      if (response.ok) {
        setSuccess("Sikeres rögzítés");
        setFormData({ serviceName: "", timeCost: "", description: "", categoryId: "" });
      } else {
        setError(data);
      }
    } catch (error) {
      setError("Hiba történt a kapcsolat során.");
    }
  };

  return (
    <section className="hero full-screen">
      <h2>Szolgáltatás Létrehozása</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="serviceName"
          placeholder="Szolgáltatás neve"
          value={formData.serviceName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="timeCost"
          placeholder="Időköltség (perc)"
          value={formData.timeCost}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Leírás"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="categoryId"
          placeholder="Kategória ID"
          value={formData.categoryId}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" className="form-button">Létrehozás</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <Link to="/">
        <button className="cta-button">Vissza a kezdőlapra</button>
      </Link>
    </section>
  );
};

export default CreateServicePage;
