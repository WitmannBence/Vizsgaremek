"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setError("Service ID not found")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetch(`http://localhost:5293/api/Service/ServiceBySERVICEID/${id}`)
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
      <div className="service-detail-container">
        <div className="service-detail-card">
          <img className="service-image" src="/placeholder.svg?height=300&width=500" alt="Service Image" />
          <div className="service-content">
            <h1 className="service-title">{service?.serviceName || "Service Name"}</h1>
            <p className="service-description">{service?.description || "No description available"}</p>
            <div className="service-info">
              <p>
                <strong>Category:</strong> {service?.category || "No category available"}
              </p>
              <p>
                <strong>Time Cost:</strong> {service?.timeCost || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(service?.createdAt).toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <Link to="/services" className="cta-button">
          Back to Services
        </Link>
      </div>
    </div>
  )
}

export default ServiceDetailPage

