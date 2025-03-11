import axios from "axios";
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
  document.title = "Time Bank | Create Service"

  useEffect(() => {
    // Fetch categories
    axios.get(`${process.env.REACT_APP_URL}/api/Category/CategoryList`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error.message));
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
    try {

    const response = await axios.post(
      `${process.env.REACT_APP_URL}/api/Service?uId=${token}`, formData);
      console.log(response);

    if (response.statusText === "OK") {
      console.log(response);
      setSuccess(response.data);
      setFormData({ serviceName: "", timeCost: "", description: "", categoryId: "" });
    } else {
      setError(response.message);
      console.log(response.message);
    }
  } catch (error){
      setError("Hiba a letöltés során");
      console.error("Hiba a letöltés során", error);
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
        <i className="bi bi-clipboard2-fill me-3"></i>
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
