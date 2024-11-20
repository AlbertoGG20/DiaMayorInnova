import { useContext } from "react";
import { navContext } from "../../../context/nav-menu/navMenuContext";
import NavItem from "./navItem/NavItem";
import { routes } from "../../../services/NavRoutes";
import "./NavBar.css";

const NavBar = () => {
  const { menuState, changeMenu } = useContext(navContext);
 
  return (
    <>
      <nav className={menuState ? "navBar_container nav--active" : "navBar_container"}>
        <i className="fi fi-rr-x close" onClick={changeMenu}></i>
        <ul className="navBar__list" >
          {routes.map((route) => {
            if (route.rol.includes("student")) {
              return <NavItem key={route.to} icon={route.icon} name={route.name} url={route.to} />
            } else return null;
          })}
        </ul>
        <div className="navBar__item"><NavItem icon="fi fi-rr-settings-sliders" name="ajustes" url="/settings" /></div>
      </nav>
    </>
  )

}
export default NavBar;