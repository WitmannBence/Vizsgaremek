import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  document.title = "Time Bank | Profile"

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services function
  const fetchServices = () => {
    const userId = localStorage.getItem("userID"); // Getting user ID for fetching services

    if (!userId) {
      console.error("User ID not found in localStorage");
      navigate("/login"); // Redirect to login if userId doesn't exist
      return;
    }

    fetch(`${process.env.REACT_APP_URL}/api/Service/ServicesByUSERID/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch services data");
        return response.json();
      })
      .then((data) => {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setLoading(false);
      });
  };

  // Handle delete service function
  const handleDeleteService = (serviceId) => {
    const token = localStorage.getItem("token"); // Get the token (uId)

    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    // Confirmation dialog before deletion
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    // Send DELETE request to the API with serviceId and uId (token)
    fetch(`${process.env.REACT_APP_URL}/api/Service?serviceId=${serviceId}&uId=${token}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 401) {
          console.log("Token expired. Redirecting to login.");
          navigate("/"); // Redirect to login if token is expired
          return;
        }
        if (!response.ok) throw new Error("Failed to delete service");
        return response.json();
      })
      .then(() => {
        console.log(`Service ${serviceId} deleted successfully`);

        // Wait for 0.5 seconds before refreshing the services list
        setTimeout(() => {
          // Update the state to reflect the service deletion
          setServices((prevServices) =>
            prevServices.filter((service) => service.serviceId !== serviceId)
          );
          // Fetch the updated list of services
          fetchServices();
        }, 1100); // Delay by 0.5 seconds
      })
      .catch((error) => console.error("Error deleting service:", error));
  };

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
      <h1 className="profile-title mt-5" style={{textAlign: 'center'}}>User Profile</h1>

      {loading ? (
        <div className="loading">Loading user data...</div>
      ) : (
        <div>
          {services.length === 0 ? (
            <p>No active services found for this user.</p>
          ) : (
            <div>
              <h3 className='mt-2 mb-5' style={{textAlign: 'center'}}>Your Active Services:</h3>
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
                              <button
                                className="btn btn-danger w-75 h-60 mb-2"
                                onClick={() => handleDeleteService(service.serviceId)}
                              >
                                Delete
                              </button>
                              <Link to={"/EditService/" + service.serviceId}>
                              <button className='btn btn-warning w-75 h-60 mb-2'>Edit</button>
                              </Link>
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
