import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { navContext } from '../context/nav-menu/navMenuContext';
import Shortcuts from "../components/shortcuts/Shortcuts";
import StudentMark from "../components/student-mark/StudentMark";
import StudentAside from "../components/student-aside/StudentAside";
import TaskListAndDetails from "../components/task/taskListAndDetails";
import StatementsSelection from "../components/task/StatementsSelection";


function Home() {
  const { currentRole } = useContext(navContext);

  if (currentRole === 'admin' || currentRole === 'center_admin') {
    return (
      <>
        <main className="home_section">
          <section className="principal">
            <Outlet />
          </section>
          <aside className="aside"></aside>
          <Shortcuts />
        </main>
      </>
    )
  }

  if (currentRole === 'teacher') {
    return (
      <>
        <main className="home_section">
          <Shortcuts />
          <section className="principal">
            <StatementsSelection
              showCheckboxes={false}
            />
          </section>
          <aside className="aside"><TaskListAndDetails /></aside>
        </main>
      </>
    )
  }

  return (
    <main className="home_section">
      <Shortcuts />
      <section className="principal">
        <StudentMark />
      </section>
      <aside className="aside">
        <StudentAside />
      </aside>
    </main>
  );
}

export default Home;