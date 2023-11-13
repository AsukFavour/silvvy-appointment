// App.js or App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AppointmentForm from './components/AppointmentForm';
import './App.css'; // Import any global styles

const App = () => {
  return (
    <Router> 
        <Routes> 
          <Route path="/" element={<AppointmentForm/>} /> 
        </Routes>
      
    </Router>
  );
};

export default App;
