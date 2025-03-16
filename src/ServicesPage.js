import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card";
import axios from "axios";
import { Dropdown } from "bootstrap";


function ServicesPage() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchServices = (categoryId = "", input = "") => {
    let url = `${process.env.REACT_APP_URL}/api/Service/AllService`;
    
    if (categoryId && input) {
      url = `${process.env.REACT_APP_URL}/api/Service/SearchService?input=${input}&categoryId=${categoryId}`;
    } else if (categoryId) {
      url = `${process.env.REACT_APP_URL}/api/Category/CategorySearch/${categoryId}`;
    } else if (input) {
      url = `${process.env.REACT_APP_URL}/api/Service/SearchService?input=${input}`;
    }
    
    axios.get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data)
      })
      .catch((error) => console.error("Error fetching services:", error));
  };

  const fetchCategories = () => {
    axios.get(`${process.env.REACT_APP_URL}/api/Category/CategoryList`)
      .then((response) => {
        setCategories(response.data);
        
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    fetchServices(newCategory, searchInput);
  };

  const handleSearchChange = (event) => {
    const newInput = event.target.value;
    setSearchInput(newInput);
    fetchServices(selectedCategory, newInput);
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
    

    document.title = "Time Bank | Services"
  }, []);

  return (
    <div style={{textAlign:"center", marginTop:50, }}>
  
  <select className="me-3" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search services..."
          value={searchInput}
          onChange={handleSearchChange}
        />

      <div className="servicespage mainBackground">
      {data.map((service) => (
        <Card
          key={service.serviceId}
          serviceId={service.serviceId} // Pass serviceId to Card
          serviceName={service.serviceName}
          timeCost={service.timeCost}
          category={service.categoryName}
          createdAt={service.createdAt}
          ownerId={service.userId}
        />
      ))}
    </div>
    </div>
  );
}

export default ServicesPage;
