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
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  let base_url = process.env.REACT_APP_URL;

  const fetchServices = (categoryId = "", input = "") => {
    let url = `${base_url}/api/Service/AllService`;
    if (categoryId && input) {
      url = `${base_url}/api/Service/SearchService?input=${input}&categoryId=${categoryId}`;
    } else if (categoryId) {
      url = `${base_url}/api/Category/CategorySearch/${categoryId}`;
    } else if (input) {
      url = `${base_url}/api/Service/SearchService?input=${input}`;
    }

    setIsLoading(true);
    axios.get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setNoResults(response.data.length === 0);
      })
      .catch((error) => {
        console.error("Error fetching services:", error.response?.data);
        setNoResults(true);
      })
      .finally(() => setIsLoading(false));
  };  

  const fetchCategories = () => {
    axios.get(`${base_url}/api/Category/CategoryList`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error.response?.data));
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
    document.title = "Time Bank | Services";

    fetchServices();
    fetchCategories();
  }, []);

  return (
    <div className="container text-center mt-5">
      <div className="search-container mb-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
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
      </div>

      {isLoading ? (<div className="loader">Loading...</div>) : noResults ? (
          <p className="w-50 mx-auto">
            Nincs találat a kiválasztott kategóriában!
          </p>
        ) : (

      <div className="servicespage mainBackground">
        {data.map((service) => (
          <Card
            key={service.serviceId}
            serviceId={service.serviceId}
            serviceName={service.serviceName}
            timeCost={service.timeCost}
            category={categories.find(cat => cat.categoryId === service.categoryId)?.categoryName || "N/A"}
            createdAt={service.createdAt}
            ownerId={service.userId}
          />
        ))}
      </div>
      )}
    </div>
  );
}

export default ServicesPage;