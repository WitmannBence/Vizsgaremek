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
    <section className="form-card">
      <h2 className="mb-4">Szolgáltatás Létrehozása</h2>
      <form onSubmit={handleSubmit}>
      <i className="bi bi-megaphone me-3"></i>
        <input className="mb-2"
          type="text"
          name="serviceName"
          placeholder="Szolgáltatás neve"
          value={formData.serviceName}
          onChange={handleChange}
          required
        />
        <br />
        <i className="bi bi-coin me-3"></i>
        <input className="mb-2"
          type="number"
          name="timeCost"
          placeholder="Időköltség (óra)"
          value={formData.timeCost}
          onChange={handleChange}
          required
        />
        <br />
        <i className="bi bi-journal me-3"></i>
        <textarea className="mb-2 " style={{width:"188px", verticalAlign: "middle"}}
          name="description"
          placeholder="Leírás"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <br />
        <select className="mb-2 ms-4" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
          <option value="">Válassz kategóriát</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <br />
        <button type="submit" className="btn btn-primary">
          Létrehozás
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </section>
  );
};

export default CreateServicePage;
