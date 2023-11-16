// components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Header.css';
import logo from '../assets/Silvvy_logo_pink.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log('Menu Toggled:', menuOpen);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className={`header-navigation ${menuOpen ? 'open' : ''}`}>
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul>
          <li>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/appointments" onClick={toggleMenu}>
              Appointments
            </Link>
          </li>
          <li>
            <Link to="/appointment-list" onClick={toggleMenu}>
              Appointment List
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
