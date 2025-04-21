import { NavLink, useLocation } from 'react-router-dom'
import useBreadcrumbs from "use-react-router-breadcrumbs";
import "./Breadcrumbs.css"

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  const { pathname } = useLocation()
  console.log(pathname)

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className='breadcrumb__container'>
          {breadcrumbs.map(({ match, breadcrumb }, index) => (
            <li key={match.pathname} className={index === breadcrumbs.length - 1 ? "breadcrumb__item breadcrumb__item--active" : "breadcrumb__item"}>
              <NavLink to={match.pathname}>
                {breadcrumb}
              </NavLink>
              {index < breadcrumbs.length - 1 && " / "}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumbs;
