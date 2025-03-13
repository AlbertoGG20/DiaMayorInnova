import { useEffect, useState } from 'react'
import { navContext } from './navMenuContext'
import { useAuth } from '../../context/AuthContext';

const NavStateProvider = ({ children }) => {
  const { user, role, userAvatarUrl } = useAuth();
  const [menuState, setMenuState] = useState(false);
  const [currentRole, setCurrentRole] = useState(role);
  const [dropdownState, setdropdownState] = useState(false);

  const userName = user ? user.name : "Pedro Picapiedra";

  const changeMenu = () => {
    setMenuState(!menuState);
  }

  const changeDropmenu = () => {
    setdropdownState(!dropdownState);
  }

  const isAdmin = role === "admin";
  const isCenterAdmin = role === "center_admin";
  const isTeacher = role === "teacher";

  const setAdminRol = () => {
    setCurrentRole("admin")
  }

  const setCenterAdminRol = () => {
    setCurrentRole("center_admin")
  }

  const setTeacherRol = () => {
    setCurrentRole("teacher")
  }

  const setStudentRol = () => {
    setCurrentRole("student")
  }

  useEffect(() => {
    setCurrentRole(role);
  }, [role])

  return (
    <navContext.Provider value={
      {
        menuState,
        userName,
        userAvatarUrl,
        dropdownState,
        isAdmin,
        isCenterAdmin,
        isTeacher,
        currentRole,
        changeMenu,
        setdropdownState,
        changeDropmenu,
        setAdminRol,
        setCenterAdminRol,
        setStudentRol,
        setTeacherRol,
      }
    }>
      {children}
    </navContext.Provider >
  )
}

export default NavStateProvider
