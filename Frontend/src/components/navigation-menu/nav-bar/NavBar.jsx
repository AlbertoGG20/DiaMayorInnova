import { useContext, useState } from "react";
import { navContext } from "../../../context/nav-menu/navMenuContext";
import NavItem from "./navItem/NavItem";
import { routes } from "../../../services/NavRoutes";
import "./NavBar.css";
import { useLocation } from "react-router-dom";
import SettingsModal from "../settings-modal/SettingsModal";

const NavBar = () => {
  const { menuState, changeMenu, currentRole } = useContext(navContext);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (location.pathname === "/sign_in") {
    return null;
  }


  return (
    <>
      <nav className={menuState ? "navBar_container nav--active" : "navBar_container"}>
        <i className="fi fi-rr-x close" onClick={changeMenu}></i>
        <ul className="navBar__list" >
          {
            routes.map((route) => {
              if (route.rol.includes(currentRole) && location !== "/sign_in") {
                return <NavItem key={route.to} icon={route.icon} name={route.name} url={route.to} />
              } else return null;
            })
          }
        </ul>
        <button className="navBar__item " id="btn--settings" onClick={openModal} aria-label="Preferencias del usuario"><i className="fi fi-rr-settings-sliders"></i></button>
        {isModalOpen && <SettingsModal onClose={closeModal} />}
      </nav>
    </>
  )

}
export default NavBar;