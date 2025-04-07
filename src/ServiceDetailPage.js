import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/")
  }

  useEffect(() => {
    if (!id) {
      setError("Service ID not found")
      setLoading(false)
      return
    }
    document.title = "Time Bank | Részletek"
    setLoading(true)
    setError(null)

    fetch(`${process.env.REACT_APP_URL}/api/Service/ServiceBySERVICEID/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        return response.json()
      })
      .then((data) => {
        console.log("Fetched service data:", data)
        setService(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching service details:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="full-screen">Loading...</div>
  }

  if (error) {
    return <div className="full-screen">Error: {error}</div>
  }

  return (
    <div className="full-screen">
      <div className="service-detail-container ">
        
            <h1 className="mt-5">{service.serviceName ? service.serviceName : "Service Name"}</h1>
          <div className="service-detail-card mt-5 " style={{alignItems:"center"}}>
          <img className="card-img-top rounded image-shadow" src={service.categoryimg} style={{height:"400px", width:"400px"}} alt="Service Image" />
          <div className="service-content mt-5">  <p className="service-description">{service.description ? service.description : "No description available"}</p>
            <div className="service-info">
              <p>
                <strong>Kategóriák:</strong> {service.categoryName ? service.categoryName : "No category available"}
              </p>
              <p>
                <strong>Ára:</strong> {service.timeCost ? service.timeCost : "N/A"} <i className="bi bi-coin"></i>
              </p>
              <p>
                <strong>Feltöltés ideje:</strong> {service.createdAt ? new Date(service.createdAt).toLocaleString(): "N/A"}
              </p>
            </div>
          </div>
        </div>
        <Link to="/services" className="cta-button">
          Vissza a szolgáltatásokhoz
        </Link>
      </div>
    </div>
  )
}

export default ServiceDetailPage

