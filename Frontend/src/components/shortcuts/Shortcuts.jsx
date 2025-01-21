import { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { scRoutes } from "../../services/ShortcutRoutes";
import Shortcut from "../../components/shortcuts/shortcut/Shortcut"
import { navContext } from '../../context/nav-menu/navMenuContext';
import { useAuth } from '../../context/AuthContext';


const Shortcuts = () => {
  const { rol } = useContext(navContext);
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <section className="top">
      <h1 className="shortcut__title">Bienvenido, {auth.user.name}</h1>
      <h2 className="shortcut__subtitle">Accesos Rápidos</h2>
      <div className="shortcut__wrapper ">
        {scRoutes.map((route) => {
          if (route.rol.includes(rol)) {
            const onClick =
              route.to === "/tasks"
                ? () => navigate("/tasks", { state: { createTask: true } })
                : null;

            return (
              <Shortcut
                key={route.to}
                icon={route.icon}
                name={route.name}
                url={route.to}
                onClick={onClick}
              />
            );
          }
        })}
      </div>
    </section>
  )
}

export default Shortcuts
