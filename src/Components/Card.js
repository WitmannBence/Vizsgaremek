import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

export default function Card({
  serviceName,
  timeCost,
  description,
  category,
  createdAt,
  additionalInfo,
  serviceId,
}) {
  const navigate = useNavigate(); // Hook for navigation

  const handleViewDetails = () => {
    // Redirect to ServiceDetailPage with the serviceId in the URL
    navigate(`/ServiceDetails/${serviceId}`);
  };

  return (
    <div className="card" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <img className="card-img-top" src="..." alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{serviceName}</h5>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Time Cost:</strong> {timeCost}</p>
        <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
      

        {/* Button to view details */}
        <button className="btn btn-primary" onClick={handleViewDetails}>
          Bővebben
        </button>
        <button className="btn btn-secondary ms-2">
          Megveszem!
        </button>
      </div>
    </div>
  );
}
