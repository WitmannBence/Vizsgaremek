import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      console.error("User ID not found in localStorage");
      navigate("/login"); // Redirect to login page if userID is not found
      return;
    }

    // Log the userID for debugging purposes
    console.log("User ID from localStorage:", userId);

    // Fetch the services for the user
    fetch(`http://localhost:5293/api/Service/ServicesByUSERID/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services data");
        }
        return response.json();
      })
      .then((data) => {
        // Log the response data for debugging
        console.log("Fetched services data:", data);

        if (Array.isArray(data) && data.length > 0) {
          setServices(data); // Set the services state if data is valid
        } else {
          setServices([]); // No services found, set to an empty array
        }
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false); // Stop loading in case of error
      });
  }, [navigate]);

  return (
    <div className="profile-page">
      <h1 className="profile-title">User Profile</h1>

      {loading ? (
        <div className="loading">Loading user data...</div>
      ) : (
        <div>
          {services.length === 0 ? (
            <p>No active services found for this user.</p>
          ) : (
            <div>
              <h3>Your Active Services:</h3>
              <div className="services-list">
                {services.map((service) => (
                  <div className="service-card" key={service.serviceId}>
                    <h4 className="service-name">{service.serviceName}</h4>
                    <p><strong>Time Cost:</strong> {service.timeCost} hours</p>
                    <p><strong>Description:</strong> {service.description}</p>
                    <p><strong>Created At:</strong> {new Date(service.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
