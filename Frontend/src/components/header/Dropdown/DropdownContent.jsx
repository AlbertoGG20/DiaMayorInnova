import React, { useEffect, useState }from "react"

const DropdownContent = (func, data) => {

    const[rol ,setRol] = useState("Profesor");

    const changeRol = () => {
        setRol("Estudiante");
    }



    return(
        <>
            <ul className="userMenu">
                {(rol==="Profesor" || rol === "Admin") &&  (<li className="userMenu_item" tabIndex={0} onClick={changeRol}><a> <i className="fi fi-rr-user"></i> Cambio de usuario</a></li>)}
                <li className="userMenu_item" tabIndex={0}><a> <i className="fi fi-rr-info"></i> Ayuda y privacidad</a></li>
                <li className="userMenu_item" tabIndex={0}><a> <i className="fi fi-rr-power"></i> Cerrar Sesión</a></li>
            </ul>
        </>
    )

}

export default DropdownContent;