import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

export default function Card({
  serviceName,
  timeCost,
  category,
  createdAt,
  serviceId,
  ownerId
}) {
  const navigate = useNavigate(); // Hook for navigation
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  const handleViewDetails = () => {
    // Redirect to ServiceDetailPage with the serviceId in the URL
    navigate(`/ServiceDetails/${serviceId}`);
  };

  
  /*const transactionPost = () => {
     axios.post(`https://localhost:5293/api/Transaction/purchase?uId=${token}`, {
        senderId: Number(userID),
        receiverId: Number(ownerId),
        userServiceId: Number(serviceId),
        timeAmount: Number(timeCost),
        description: "",
        transactionDate: "2025-03-04T10:58:36.902Z",
        transactionCode: "",
        sender: null,
        userService: null
     })
  } */
   

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
        <button className="btn btn-secondary ms-2" /*onClick={transactionPost()}*/ >
          Megveszem!
        </button>
      </div>
    </div>
  );
}

