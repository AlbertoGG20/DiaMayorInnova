import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom'
import Home from "./pages/Home";
import AccountingPlan from './components/accounting-plan/AccountingPlan';
import AccountingPlanList from './components/accounting-plan/ListAccountingPlan';
import AddAccountingPlan from './components/accounting-plan/AddAccountingPlan';
import ClassGroup from "./components/class-group/ClassGroup";
import ClassGroups from "./pages/class-group/ClassGroup";
import AddClassGroup from "./components/class-group/AddClassGroup";
import SchoolsCenters from './components/schoolCenters/SchoolCenters'
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/private-route/PrivateRoute";
import SignIn from "./components/user/SignIn";
import NavStateProvider from "./context/nav-menu/NavStateProvider";
import NavigationMenu from "./components/navigation-menu/NavigationMenu";
import Account from './components/account/Account';
// import AccountList from './components/account/ListAccount';
// import AddAccount from './components/account/AddAccount';
import HelpExample from './components/help-example/HelpExample';
import HelpExampleList from './components/help-example/ListHelpExample';
import AddHelpExample from './components/help-example/AddHelpExample';
import TaskListAndDetails from './components/task/taskListAndDetails';
import ExerciseMarksList from './components/task/ExerciseMarksList';
import StatementsList from './components/statements/StatementList';
import Modes from './pages/modes/Modes';
import AccountingPlans from './pages/accounting-plan/AccountingPlans';
import TaskPage from './pages/modes/task-page/TaskPage';
import PracticePage from './pages/modes/practice-page/PracticePage';
import ExamPage from './pages/modes/exam-page/ExamPage';
import Accounts from './pages/account/Accounts';
import TaskCreateForm from './components/task/TaskCreateForm';
import StatementCreateForm from './components/statements/StatementCreateForm';
import 'react-tooltip/dist/react-tooltip.css'
import './App.css';
import './assets/Styles/Global.css';
import UserManagement from './components/user/UserManagement';
import ExamInformation from './components/task/ExamInformation/ExamInformation';

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <NavStateProvider>
            <NavigationMenu />
            <div className='app-main'>
              <Routes>
                <Route path="/sign_in" element={<SignIn />} />
                <Route path="*" element={<Home />} />
                <Route element={<PrivateRoute allowedRoles={['admin', 'center_admin', 'teacher', 'student']} />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/modes" element={<Modes />} >
                    <Route path="tarea/:exerciseId" element={<TaskPage />} />
                    <Route path='practica/' element={<PracticePage />} />
                    <Route path='examen/:exerciseId' element={<ExamPage />} />
                  </Route>
                  <Route path="/help-examples" element={<HelpExampleList />} />
                  <Route path="/help-examples/:id" element={<HelpExample />} />
                  <Route path="/add-help-example" element={<AddHelpExample />} />
                  <Route element={<PrivateRoute allowedRoles={['admin', 'center_admin', 'teacher']} />}>
                    <Route path="/accounting-plans" element={<AccountingPlans />} />
                    <Route path="/accounting-plans/:id" element={<AccountingPlan />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/accounts/:id" element={<Account />} />
                    <Route path="/tasks" element={<TaskListAndDetails />} />
                    <Route path="/task-edit" element={<TaskCreateForm />} />
                    <Route path="/notas-estudiantes/:id" element={<ExerciseMarksList />} />
                    <Route path="/notas-estudiantes/:id/examen/:exerciseId" element={<ExamInformation />} />
                    <Route path="/statements" element={<StatementsList />} />
                    <Route path="/add-statements" element={<StatementCreateForm />} />
                    <Route path="/add-accounting-plan" element={<AddAccountingPlan />} />
                    <Route path="/schools" element={<SchoolsCenters />} />
                    <Route path="/class-list" element={<ClassGroups />} />
                    <Route path="/add-class-list" element={<AddClassGroup />} />
                    <Route path="/class-list/:id" element={<ClassGroup />} />
                    <Route element={<PrivateRoute allowedRoles={['admin', 'center_admin']} />}>
                      <Route path="/users" element={<UserManagement/>} />
                      <Route path="/home" element={<Home />} >
                        <Route path='escuelas/' element={<SchoolsCenters />} />
                        <Route path='usuarios/' element={<UserManagement />} />
                      </Route >

                    </Route>
                  </Route>
                </Route>
              </Routes>
            </div>
          </NavStateProvider>
        </AuthProvider>
      </Router >
    </>
  )
}

export default App;
