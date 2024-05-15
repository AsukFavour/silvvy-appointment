// components/Header.jsx
import { Link } from 'react-router-dom';
import '../Styles/Header.css';
import logo from '../assets/Silvvy_logo_pink.png';

const Header = () => {
  

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className={`header-navigation `}>
        
     
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
