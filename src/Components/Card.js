import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export default function Card({
  serviceName,
  timeCost,
  category,
  createdAt,
  serviceId,
  ownerId
}) {

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  
  const transactionPost = () => {
     axios.post(`${process.env.REACT_APP_URL}/api/Transaction/purchase?uId=${token}`, {
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
     .then((response) => {
      console.log("Transaction response:", response.data);
     })
     .catch((error) => {
        console.error("Error fetching services:", error.response.data);
        alert(error.response.data + "!")
     });
  }

  const formattedDate = new Date(createdAt).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <img className="card-img-top rounded-top" src={`https://picsum.photos/id/${Math.round(Math.random()*20)+1}/200`} alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{serviceName}</h5>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Time Cost:</strong> {timeCost}</p>
        <p><strong>Created At:</strong> {formattedDate}</p>

        <Link to={`/ServiceDetails/${serviceId}`}>
          <div className="btn btn-primary">
            Bővebben
          </div>
        </Link>

        <button className="btn btn-secondary ms-2" onClick={transactionPost} >
          Megveszem!
        </button>
      </div>
    </div>
  );
}
