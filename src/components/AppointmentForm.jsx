import { useState, useEffect } from 'react';
import client from '../SanityClient';
import '../Styles/AppointmentForm.css'; // Import the stylesheet
import Header from './Header';
import silvvylogo from '../assets/Silvvy_logo_pink.png';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';


const AppointmentForm = () => {
  const [services, setServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryPrice, setSubcategoryPrice] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    service: '',
    subcategory: '',
    date: '',
    time: '',
    price: '', 
  });

  useEffect(() => {
    // Fetch services from Sanity
    const fetchServices = async () => {
      try {
        const response = await client.fetch('*[_type == "service"]');
        setServices(response);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const fetchSubcategoriesForService = async (serviceId) => {
    try {
      // Fetch subcategories that reference the selected service
      const response = await client.fetch(
        '*[_type == "subcategory" && references($service)]',
        {
          service: serviceId,
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'service') {
      const subcategoriesForService = await fetchSubcategoriesForService(value);
      setSubcategories(subcategoriesForService);
    }

    if (name === 'subcategory') {
      const selectedSubcategory = subcategories.find((subcategory) => subcategory._id === value);
      setSelectedSubcategory(selectedSubcategory);
      setSubcategoryPrice(selectedSubcategory ? selectedSubcategory.price : null);
    }
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



  const config = {
    public_key: 'FLWPUBK_TEST-6e5439ace1ccba8e51f2399f835ac2e6-X',
    tx_ref: Date.now(),
    amount: subcategoryPrice , // Convert to kobo or cent depending on your currency
    currency: 'NGN', // Change this to your currency code
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: formData.email,
      phone_number: formData.phoneNumber,
      name: formData.name,
    },
    customizations: {
      title: 'Silvvy_Signature',
      description: 'Payment for appointment booking',
      logo: silvvylogo,
    },
  };
  const handleFlutterPayment  = useFlutterwave(config)


 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidTime() || !isValidDate()) {
      alert(
        'Please select a valid date and time (Monday to Saturday, 10:30 AM to 5 PM).'
      );
      return;
    }
    // Validate form fields if needed
    try {
      
      // Initialize payment
      await handleFlutterPayment({
        callback: async (response) => {
          // console.log(response);
          if (response.status === 'successful') {
            // Payment successful, proceed to submit appointment
            await submitAppointment(); // Use await here to ensure submission before clearing the form
          } else {
            // Payment failed or was cancelled
            // console.error('Payment failed:', response);
            alert('Payment was not successful. Please try again.');
          }
          closePaymentModal(); // Close the payment modal
        },
        onClose: () => {},
      });
    } catch (error) {
      // Handle error (e.g., show an error message)
      // console.error('Error initiating payment:', error);
    
  }
   
  };

  const submitAppointment = async () => {
    try {
      // Submit data to Sanity backend
      await client.create({
        _type: 'appointment',
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        service: {
          _type: 'reference',
          _ref: formData.service,
        },
        subcategory: {
          _type: 'reference',
          _ref: formData.subcategory,
        },
        price: selectedSubcategory ? selectedSubcategory.price : null,
        date: formData.date,
        time: formData.time,
      });
  
      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        service: '',
        subcategory: '',
        date: '',
        time: '',
        price: '',
        subcategoryPrice: '',
      });
  
      // Optionally, show a success message to the user
      alert('Appointment booked successfully!');
    } catch (error) {
      // Handle error (e.g., show an error message)
      // console.error('Error submitting appointment:', error);
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
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        {formData.service && (
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
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {selectedSubcategory && (
          <div>
            
            Price: ₦{subcategoryPrice}
          </div>
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

        <button type="submit">Book Appointment</button>
      </form>
    </>
  );
};

export default AppointmentForm;
