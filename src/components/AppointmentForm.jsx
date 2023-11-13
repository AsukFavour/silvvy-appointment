// components/AppointmentForm.jsx
import { useState } from 'react';
// import sanityClient from '../services/sanity';
import '../Styles/AppointmentForm.CSS'; // Import the stylesheet
import Header from './Header';

const services = ['Lash', 'Brows', 'Lips'];

const subcategories = {
  Lash: ['Classic', 'Volume', 'Hybrid'],
  Brows: ['Microblading', 'Shading', 'Tinting'],
  Lips: ['Lip Blush', 'Lip Liner', 'Full Lips'],
};

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    service: '',
    subcategory: '',
    date: '',
    time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidTime = () => {
    const selectedTime = new Date(`2023-01-01T${formData.time}`);
    const startTime = new Date(`2023-01-01T10:30:00`);
    const endTime = new Date(`2023-01-01T17:00:00`);

    return selectedTime >= startTime && selectedTime <= endTime;
  };

  const isValidDate = () => {
    const selectedDate = new Date(formData.date);
    // Check if the selected date is Monday to Saturday
    return selectedDate.getDay() >= 1 && selectedDate.getDay() <= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidTime() || !isValidDate()) {
        alert('Please select a valid date and time (Monday to Saturday, 10:30 AM to 5 PM).');
        return;
      }

    // Validate form fields if needed

    try {
      // Submit data to Sanity backend
    //   await sanityClient.create({
    //     _type: 'appointment',
    //     name: formData.name,
    //     email: formData.email,
    //     phoneNumber: formData.phoneNumber,
    //     service: formData.service,
    //     subcategory: formData.subcategory,
    //     date: formData.date,
    //     time: formData.time,
    //   });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        service: '',
        subcategory: '',
        date: '',
        time: '',
      });

      // Optionally, show a success message to the user
      alert('Appointment booked successfully!');
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error submitting appointment:', error);
    }
  };

  return (
    <>
    <Header/>
    <form className="appointment-form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Phone Number:
        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
      </label>

      <label>
        Service:
        <select name="service" value={formData.service} onChange={handleChange} required>
          <option value="" disabled>Select a service</option>
          {services.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </label>

      {formData.service && (
        <label>
          Subcategory:
          <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
            <option value="" disabled>Select a subcategory</option>
            {subcategories[formData.service].map((subcategory) => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </label>
      )}

      <label>
        Date:
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </label>

      <label>
        Time:
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
      </label>

      <button type="submit">Submit Appointment</button>
    </form>
    </>
  );
};

export default AppointmentForm;
