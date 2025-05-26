import { NavLink } from 'react-router-dom';
import './Shortcut.css';
import { Tooltip } from 'react-tooltip';

const Shortcut = ({
  icon = "fi fi-rr-home",
  name = "Inicio",
  url = "/home",
  onClick = null,
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  let tooltipName = "";
  if (name == "Tarea") {
    tooltipName = "Supuesto"
  }
  if (name == "Enunciado") {
    tooltipName = "Operación"
  }


  return (<>
    <NavLink
      className='shortcut__container'
      to={url}
      onClick={handleClick}
      aria-label={name}
      data-tooltip-id="my-tooltip"
      data-tooltip-content={tooltipName}
      data-tooltip-place="bottom">
      <i className={`shortcut__icon ${icon}`}></i>
      <p className='shortcut__text'>{name}</p>
    </NavLink>
    <Tooltip id="my-tooltip" place='bottom' />
  </>
  )
}

export default Shortcut
