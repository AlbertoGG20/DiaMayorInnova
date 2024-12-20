import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { navContext } from '../context/nav-menu/navMenuContext';
import Shortcuts from "../components/shortcuts/Shortcuts";
import StudentMark from "../components/student-mark/StudentMark";
import StudentAside from "../components/student-aside/StudentAside";


function Home() {
  const navigate = useNavigate();
  const { rol } = useContext(navContext);

  if (rol === 'admin') {
    return (
      <>
        <main className="home_section">
          <section className="principal">
            <div className="buttons_container">
              <button onClick={() => navigate("/class-list")}>Mostrar la lista de Grupos de clase</button>
              <button onClick={() => navigate("/accounting-plans")}>Mostrar la lista de Accounting plans</button>
              <button onClick={() => navigate("/schools")}>Mostrar Schools centers</button>
              <button onClick={() => navigate("/sign_up")}>Registro</button>
            </div>
          </section>
          <aside className="aside"></aside>
          <Shortcuts />

        </main>
      </>
    )
  }

  if (rol === 'teacher') {
    return (
      <>
        <main className="home_section">
          <Shortcuts />
          <section className="principal">
            <div className="buttons_container">
              <button onClick={() => navigate("/class-list")}>Mostrar la lista de Grupos de clase</button>
              <button onClick={() => navigate("/accounting-plans")}>Mostrar la lista de Accounting plans</button>
              <button onClick={() => navigate("/schools")}>Mostrar Schools centers</button>
              <button onClick={() => navigate("/tasks")}>Mostrar Tareas</button>
              <button onClick={() => navigate("/statements")}>Mostrar Enunciados</button>
            </div>
          </section>
          <aside className="aside"></aside>
        </main>
      </>
    )
  }

  return (
    <main className="home_section">
      <Shortcuts />
      <section className="principal">
        <StudentMark />
        <button onClick={() => navigate("/accounting-plans")}>Mostrar la lista de Accounting plans</button>
      </section>
      <aside className="aside">
        <StudentAside />
      </aside>
    </main>
  );
}

export default Home;