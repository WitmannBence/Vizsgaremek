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

    console.log("User ID from localStorage:", userId);

    fetch(`http://localhost:5293/api/Service/ServicesByUSERID/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched services data:", data);
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  }, [navigate]);

  // Helper function to split the array into chunks of 3
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <div className="profile-page container">
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
                {chunkArray(services, 3).map((serviceRow, rowIndex) => (
                  <div className="row mb-3" key={rowIndex}>
                    {serviceRow.map((service) => (
                      <div className="col-md-4 d-flex" key={service.serviceId}>
                        <div className="card h-100 w-100 shadow">
                          <div className="card-body d-flex flex-column">
                            <h4 className="service-name">{service.serviceName}</h4>
                            <p><strong>Time Cost:</strong> {service.timeCost} hours</p>
                            <p><strong>Description:</strong> {service.description}</p>
                            <p><strong>Created At:</strong> {new Date(service.createdAt).toLocaleString()}</p>
                            <div className="mt-auto">
                                <button className="btn btn-danger w-100 h-100" onClick={() => handleDeleteService(service.serviceId)}>
                                    Delete
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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