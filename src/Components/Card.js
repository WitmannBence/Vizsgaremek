import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export default function Card({
  serviceName,
  timeCost,
  category,
  createdAt,
  serviceId,
  ownerId,
  isBought
}) {

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const timeBalance = localStorage.getItem("timeBalance")
  
  //Function for purchasing services
  const transactionPost = () => {

    let body = {
      transactionId: 0,
        senderId: 0,
        receiverId: 0,
        userServiceId: Number(serviceId),
        timeAmount: 0,
        description: "",
        transactionDate: null,
        transactionCode: "",
        sender: null,
        user: null
    }

    console.log(body);
     axios.post(`${process.env.REACT_APP_URL}/api/Transaction/purchase?uId=${token}`, body)
     .then((response) => {
      alert("Sikeres tranzakció!");
      localStorage.setItem("timeBalance", timeBalance - timeCost)
      window.location.reload();
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
          localStorage.getItem("userID") == ownerId ? <h4 className="error-message">Saját</h4> : isBought ? <h4>Már igénybe vett</h4> : null
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

