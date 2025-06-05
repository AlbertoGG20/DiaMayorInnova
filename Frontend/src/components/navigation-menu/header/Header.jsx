import useScreenSize from '../../../hooks/useScreenSize';
import innovaLogoSmall from '/innova_small.svg';
import innovaLogo from '/innova.svg';
import Dropdown from './dropdown/Dropdown';
import { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navContext } from "../../../context/nav-menu/navMenuContext";
import './Header.css';

const Header = () => {
  const { changeMenu } = useContext(navContext);
  const [logo, setLogo] = useState(innovaLogo);
  const location = useLocation();
  const screenSize = useScreenSize();

  useEffect(() => {
    if (screenSize.width < 800) {
      setLogo(innovaLogoSmall);
    } else {
      setLogo(innovaLogo);
    }
  }, [screenSize.width]);

  // Rutas donde se muestra el header simple
  const authRoutes = ['/sign_in', '/forgot-password', '/reset-password'];

  if (authRoutes.includes(location.pathname)) {
    return (
      <nav className="header">
        <NavLink to={"/home"}>
          <img src={logo} className="logo" alt="Innova logo" />
        </NavLink>
      </nav>
    )
  }

  return (
    <nav className="header">
      <i className='fi fi-rr-menu-burger' onClick={changeMenu}></i>
      <NavLink to={"/home"}><img src={logo} className="logo" alt="Innova logo" /></NavLink>
      <div className="header_userZone"> 
        <Dropdown />
      </div>
    </nav>
  )
}

export default Header;