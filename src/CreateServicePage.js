import { useState, useEffect } from "react";

const CreateServicePage = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    timeCost: "",
    description: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5293/api/Category/CategoryList")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Retrieve the token from localStorage (key is 'token')
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not logged in.");
      return;
    }

    // Post service data to the backend with the token in the URL
    const response = await fetch(
      `http://localhost:5293/api/Service?uId=${token}`, // Pass token as query parameter
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.text();
    if (response.ok) {
      setSuccess(result);
      setFormData({ serviceName: "", timeCost: "", description: "", categoryId: "" });
    } else {
      setError(result);
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
          placeholder="Időköltség (óra)"
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
        ></textarea>
        <br />
        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
          <option value="">Válassz kategóriát</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <br />
        <button type="submit" className="form-button">
          Létrehozás
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </section>
  );
};

export default CreateServicePage;
