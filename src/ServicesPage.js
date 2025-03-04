import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card";
import axios from "axios";


function ServicesPage() {
  const [data, setData] = useState([]);

  function Get() {
    axios.get("http://localhost:5293/api/Service/AllService")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      });
  }

  useEffect(() => {
    Get();

    document.title = "Time Bank | Services"
  }, []);

  return (
    <div className="servicespage mainBackground">
      {data.map((service) => (
        <Card
          key={service.serviceId}
          serviceId={service.serviceId} // Pass serviceId to Card
          serviceName={service.serviceName}
          timeCost={service.timeCost}
          category={service.category}
          createdAt={service.createdAt}
          ownerId={service.userId}
        />
      ))}
    </div>
  );
}

export default ServicesPage;
