import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/")
  }

  const [service, setService] = useState({
    serviceId: id,
    userId: "",
    serviceName: "",
    timeCost: "",
    description: "",
    createdAt: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  document.title = "Time Bank | Módosítás"

  useEffect(() => {
    if (!id) {
      setError("Service ID not found");
      setLoading(false);
      return;
    }

    axios.get(`${process.env.REACT_APP_URL}/api/Service/ServiceBySERVICEID/${id}`)
      .then((res) => {
        console.log(res.statusText);
        if (res.statusText !== "OK") throw new Error("Failed to fetch service data");

        console.log(res);
        setService(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]); 

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/api/Category/CategoryList`)
      .then((res) => setCategories(res.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Unauthorized: Please log in first.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/Service/${id}?uId=${token}`, service);

      if (response.statusText !== "OK") {
        throw new Error(response.message || "Failed to update service");
      }

      navigate(`/services/${id}`);
    } catch (err) {
      console.error("Error updating service:", err);
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="form-card">
      <h2 className="mb-4">Szolgáltatás szerkesztése</h2>
      <form onSubmit={handleSubmit}>
        <label className="mb-3 ">
        <i className="bi bi-vector-pen me-3"></i>
          <input
            placeholder="Service Name"
            type="text"
            name="serviceName"
            value={service.serviceName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <i className="bi bi-cash me-3"></i>
        <label className="mb-3">
          <input
            placeholder="Time Cost"
            type="number"
            name="timeCost"
            value={service.timeCost}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <i className="bi bi-clipboard2-fill me-3 "></i>
        <label className="mb-3">
          <textarea style={{width:"188px", verticalAlign: "middle"}}
            placeholder="Description"
            name="description"
            value={service.description}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label className="ms-4">
          <select
            name="categoryId"
            value={service.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Kategóriák</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" className="cta-button">
          Változtatások mentése
        </button>
      </form>
    </div>
  );
};

export default EditServicePage;
