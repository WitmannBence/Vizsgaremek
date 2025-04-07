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
  isBought,
  categoryimg
}) {

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");
  const timeBalance = localStorage.getItem("timeBalance")

  //Function for purchasing services
  const transactionPost = () => {

    let body = {
      senderId: Number(userID),
      receiverId: ownerId,
      userServiceId: Number(serviceId),
      timeAmount: timeCost,
      description: "Tranzakció sikeres",
      transactionDate: null,
      transactionCode: "",
      sender: null,
    }

    console.log(body);

    axios.post(`${process.env.REACT_APP_URL}/api/Transaction/purchase?uId=${token}`, body)
      .then((response) => {
        alert("Sikeres tranzakció!");
        console.log("Transaction response:", response.data);
        localStorage.setItem("timeBalance", Number(timeBalance) - Number(timeCost));
        // window.location.reload();

      })
      .catch((error) => {
        console.error("Error fetching services: ", error.message);
        alert("Hiba a tranzakció során!")
      });
  }

  const isOwner = Number(userID) === ownerId;
  const canBuy = !isOwner && !isBought;

  const formattedDate = new Date(createdAt).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="card shadow-sm border-0" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <img 
        className="card-img-top rounded-top image-shadow-s mt-1 mb-2" 
        src={categoryimg || `https://picsum.photos/id/${Math.round(Math.random() * 20) + 1}/1920`} 
        alt="Card image cap" 
      />
      <div className="card-body">
        <h3 className="card-title">{serviceName}</h3>

        {isOwner && <h4 className="error-message">Saját</h4>}
        {!isOwner && isBought && <h4 className="success-message">Már igénybe vett</h4>}
        <p><strong>Ára:</strong> {timeCost} <i className="bi bi-coin"></i></p>
        <p><strong>Feltöltés ideje:</strong> {formattedDate}</p>

        <div className="button-row mt-auto d-flex gap-2">
          <Link to={`/ServiceDetails/${serviceId}`} className="btn btn-primary flex-fill text-center">
            Bővebben
          </Link>
          <button
            className="btn btn-secondary flex-fill"
            onClick={() => {
              if (window.confirm("Biztosan meg szeretnéd venni?")) transactionPost();
            }}
            disabled={isOwner || !canBuy}

          >
            Megveszem!
          </button>
        </div>
      </div>

    </div>
  );
}

