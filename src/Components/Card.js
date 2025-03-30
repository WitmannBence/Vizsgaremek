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

/*    "transactionId": 0,
    "senderId": 1,
    "receiverId": 6,
    "userServiceId": 0,
    "timeAmount": 0,
    "description": "string",
    "transactionDate": "2025-03-25T11:36:17.338Z",
    "transactionCode": "string",
    "sender": null,
    "userService": null,
    "user": null
*/

     axios.post(`${process.env.REACT_APP_URL}/api/Transaction/purchase?uId=${token}`, {
        transactionId: 0,
        senderId: Number(userID),
        receiverId: Number(ownerId),
        userServiceId: Number(serviceId),
        timeAmount: Number(timeCost),
        description: "Teszt",
        transactionDate: "",
        transactionCode: "",
        sender: null,
        user: null
     })
     .then((response) => {
      alert("Sikeres tranzakció!");
      console.log("Transaction response:", response.data);
     })
     .catch((error) => {
        console.error("Error fetching services: ", error.message);
        alert("Hiba a tranzakció során!")
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
    <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <img className="card-img-top rounded-top image-shadow-s mt-1 mb-2" src={`https://picsum.photos/id/${Math.round(Math.random()*20)+1}/1920`} alt="Card image cap" />
      <div className="card-body">
        <h3 className="card-title">{serviceName}</h3>
        {
          localStorage.getItem("userID") == ownerId ? <h4 className="error-message">Saját</h4> : null
        }
        <p><strong>Kategória:</strong> {category}</p>
        <p><strong>Ára</strong> {timeCost} <i className="bi bi-coin"></i></p>
        <p><strong>Feltöltés ideje:</strong> {formattedDate}</p>

        <Link to={`/ServiceDetails/${serviceId}`}>
          <div className="btn btn-primary">
            Bővebben
          </div>
        </Link>

        <button className="btn btn-secondary ms-2" onClick={() => {
            if (window.confirm("Biztosan meg szeretnéd venni?")) {transactionPost()}
        }}
        disabled={localStorage.getItem("userID") == ownerId }
        >
          Megveszem!
        </button>
      </div>
    </div>
  );
}

