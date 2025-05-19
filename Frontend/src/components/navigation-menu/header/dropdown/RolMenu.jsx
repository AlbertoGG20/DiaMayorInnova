import { useContext } from 'react'
import { navContext } from '../../../../context/nav-menu/navMenuContext';

const RolMenu = () => {

  const { setAdminRol, setTeacherRol, setStudentRol, isAdmin } = useContext(navContext);


  return (
    <ul>
      {isAdmin && <li className="userMenu_item" tabIndex={0} onClick={setAdminRol}><a> <i className="fi fi-rr-user"></i>Admin</a></li>}
      <li className="userMenu_item" tabIndex={0} onClick={setTeacherRol}><a> <i className="fi fi-rr-user"></i>Profesor</a></li>
      <li className="userMenu_item" tabIndex={0} onClick={setStudentRol}><a> <i className="fi fi-rr-user"></i>Estudiante</a></li>
    </ul>
  )
}

export default RolMenu
