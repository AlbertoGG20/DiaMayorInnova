import DropdownContent from "./DropdownContent";
import { useContext, useEffect, useRef, useState } from "react";
import { navContext } from "../../../../context/nav-menu/navMenuContext";
import { useAuth } from "../../../../hooks/useAuth";
import './Dropdown.css';

const Dropdown = () => {
  const { name, rol, dropdownState, setdropdownState, changeDropmenu } = useContext(navContext);
  const { user, userAvatarUrl } = useAuth();

  const dropdownRef = useRef(null);
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setdropdownState(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userName = user ? user.email.split('@')[0] : "Pedro Picapiedra";
  const avatarUrl = userAvatarUrl;

  return (
    <div ref={dropdownRef} className="dropdown-container">
      <a className="userZone" tabIndex={0} onClick={changeDropmenu} >
        <div className="userZone_menu">
          {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="userZone_userFoto" />
              ) : (
                <i className=" text__user fi fi-rr-user"></i>
              )}
          <div className='menuInfo'>
            <p className='menuInfo_name'>{userName}</p>
            <p className='menuInfo_rol'>{rol}</p>
          </div>
        </div>
        <i className='fi fi-rr-angle-small-down'></i>
      </a>
      {dropdownState && <DropdownContent />}
    </div>
  )
}

export default Dropdown;