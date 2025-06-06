import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavStateProvider from './context/nav-menu/NavStateProvider';
import NavigationMenu from './components/navigation-menu/NavigationMenu';
import PrivateRoute from './components/private-route/PrivateRoute';
import SignIn from './components/user/SignIn';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import UserManagement from './components/user/UserManagement';
import Home from './pages/Home';
import Accounts from './pages/account/Accounts';
import Account from './components/account/Account';
import AccountingPlans from './pages/accounting-plan/AccountingPlans';
import AccountingPlan from './components/accounting-plan/AccountingPlan';
import AddAccountingPlan from './components/accounting-plan/AddAccountingPlan';
import ClassGroups from './pages/class-group/ClassGroup';
import ClassGroup from './components/class-group/ClassGroup';
import AddClassGroup from './components/class-group/AddClassGroup';
import HelpExampleList from './components/help-example/ListHelpExample';
import HelpExample from './components/help-example/HelpExample';
import AddHelpExample from './components/help-example/AddHelpExample';
import Modes from './pages/modes/Modes';
import PracticePage from './pages/modes/practice-page/PracticePage';
import TaskPage from './pages/modes/task-page/TaskPage';
import TaskListAndDetails from './components/task/taskListAndDetails';
import TaskCreateForm from './components/task/TaskCreateForm';
import ExamPage from './pages/modes/exam-page/ExamPage';
import ExerciseMarksList from './components/task/ExerciseMarksList';
import ExamInformation from './components/task/ExamInformation/ExamInformation';
import StatementsList from './components/statements/StatementList';
import StatementCreateForm from './components/statements/StatementCreateForm';
import SchoolsCenters from './components/schoolCenters/SchoolCenters'
import 'react-tooltip/dist/react-tooltip';
import './assets/styles/index.scss';
import './App.css';

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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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
