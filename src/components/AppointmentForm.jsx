// components/AppointmentForm.jsx
import { useState, useEffect } from "react";
import client from "../SanityClient";
import "../Styles/AppointmentForm.CSS"; // Import the stylesheet
import Header from "./Header";

const AppointmentForm = () => {
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    service: "",
    subcategory: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    // Fetch services from Sanity
    const fetchServices = async () => {
      try {
        const response = await client.fetch('*[_type == "service"]');
        setServices(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    // Fetch subcategories from Sanity
    const fetchSubcategories = async () => {
      try {
        const response = await client.fetch('*[_type == "subcategory"]');
        const subcategoriesByService = response.reduce((acc, subcategory) => {
          const serviceName = subcategory.service._ref;
          acc[serviceName] = acc[serviceName] || [];
          acc[serviceName].push(subcategory);
          return acc;
        }, {});

        console.log("Subcategories by service:", subcategoriesByService);
        setSubcategories(subcategoriesByService);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchServices();
    fetchSubcategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidTime = () => {
    const currentYear = new Date().getFullYear();
    const selectedTime = new Date(`${currentYear}-01-01T${formData.time}`);
    const startTime = new Date(`${currentYear}-01-01T10:30:00`);
    const endTime = new Date(`${currentYear}-01-01T17:00:00`);

    return selectedTime >= startTime && selectedTime <= endTime;
  };

  const isValidDate = () => {
    const selectedDate = new Date(formData.date);
    // Check if the selected date is Monday to Saturday
    return selectedDate.getDay() >= 1 && selectedDate.getDay() <= 6;
  };

  const getPriceForSubcategory = (subcategoryID) => {
    const subcategory = subcategories[formData.service].find(
      (subcategory) => subcategory._id === subcategoryID
    );
    return subcategory ? subcategory.price : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidTime() || !isValidDate()) {
      alert(
        "Please select a valid date and time (Monday to Saturday, 10:30 AM to 5 PM)."
      );
      return;
    }

    // Validate form fields if needed

    try {
      // Log the data being submitted

      // Submit data to Sanity backend
      await client.create({
        _type: "appointment",
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        service: formData.service,
        subcategory: formData.subcategory,
        date: formData.date,
        time: formData.time,
      });

      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        service: "",
        subcategory: "",
        date: "",
        time: "",
      });

      // Optionally, show a success message to the user
      alert("Appointment booked successfully!");
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <>
      <Header />
      <form className="appointment-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service:
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        {formData.service && subcategories[formData.service] && (
          <>
            <label>
              Subcategory:
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a subcategory
                </option>
                {subcategories[formData.service].map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Display price based on selected subcategory */}
            <p>Price: {getPriceForSubcategory(formData.subcategory)}</p>
          </>
        )}

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit Appointment</button>
      </form>
    </>
  );
};

export default AppointmentForm;
