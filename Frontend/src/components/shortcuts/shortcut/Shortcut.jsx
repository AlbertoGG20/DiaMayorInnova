import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './Shortcut.css';

const Shortcut = ({
  icon = 'fi fi-rr-home',
  name = 'home',
  url = '/home',
  tooltipName = '',
  onClick = null,
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
  <>
    <NavLink
      className='shortcut__container'
      to={url}
      onClick={handleClick}
      aria-label={name}
      data-tooltip-id='my-tooltip'
      data-tooltip-content={tooltipName}
      data-tooltip-place='bottom'>
        <i className={`shortcut__icon ${icon}`}></i>
        <p className='shortcut__text'>{name}</p>
    </NavLink>
    <Tooltip id='my-tooltip' place='bottom' />
  </>
  )
}

export default Shortcut
