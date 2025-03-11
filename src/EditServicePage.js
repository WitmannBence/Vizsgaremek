import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!id) {
      setError("Service ID not found");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5293/api/Service/ServiceBySERVICEID/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch service data");
        return res.json();
      })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching service:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch("http://localhost:5293/api/Category/CategoryList")
      .then((response) => response.json())
      .then((data) => setCategories(data))
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
      const response = await fetch(
        `http://localhost:5293/api/Service/${id}?uId=${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(service),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update service");
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
      <h2 className="mb-4">Edit Service</h2>
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
        <i class="bi bi-cash me-3"></i>
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
        <i class="bi bi-clipboard2-fill me-3 "></i>
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
        <label>
          <select
            name="categoryId"
            value={service.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" className="cta-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditServicePage;
