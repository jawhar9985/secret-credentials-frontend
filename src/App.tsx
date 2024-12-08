import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Login';
import Resetpassword from './pages/Resetpassword';
import Confirmresetpassword from './pages/Confirmresetpassword';
import User from './pages/User';
import Notfound from './pages/Notfound';
import Noaccess from './pages/Noaccess';
import Superadmin from './pages/Superadmin';
import Projects from './pages/Projects';
import Myprojects from './pages/Myprojects';
import PrivateRouter from './components/PrivateRouter';
import SuperAdminRouter from './components/SuperAdminRouter';
import ForceRedirect from './components/ForceRedirect';
import NavbarWrapper from './pages/AppNavBar';
import CreateProjectForm from './pages/CreateProjectForm';
import ListOfUsers from './pages/ListOfUsers';
import EditUser from './pages/EditUser';
import AddUserForm from './pages/AddUserForm';
import AddProjectUser from './pages/AddProjectUser';
import EditProjectUserRole from './pages/EditProjectUserRole';
import AddEnvironmentForm from './pages/AddEnvironment';
import AddEditValues from './pages/AddEditValues';
import Modaltest from './pages/AddValues';
import './App.css'


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavbarWrapper /> {/* Include the NavbarWrapper */}
        <Routes>
          <Route path="/" element={
            <ForceRedirect>
              <Login />
            </ForceRedirect>
          } />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/confirm-reset-password" element={<Confirmresetpassword />} />
          <Route path="/super-admin" element={
            <SuperAdminRouter>
              <Superadmin />
            </SuperAdminRouter>
          } />
          <Route path="/list-of-users" element={
            <SuperAdminRouter>
              <ListOfUsers />
            </SuperAdminRouter>
          } />
          <Route path="/edit-user/:userId" element={
            <SuperAdminRouter>
              <EditUser />
            </SuperAdminRouter>
          } />
          <Route path="/add-user" element={
            <SuperAdminRouter>
              <AddUserForm />
            </SuperAdminRouter>
          } />
          <Route path="/user" element={
            <PrivateRouter>
              <User />
            </PrivateRouter>
          } />
          <Route path="/add-edit-values/:projectId" element={
            <PrivateRouter>
              <AddEditValues/>
            </PrivateRouter>
          } />
          <Route path="/add-project-user/:projectId" element={
            <PrivateRouter>
              <AddProjectUser />
            </PrivateRouter>
          } />
          <Route path="/edit-project-user-role/:projectId/:userId" element={
            <PrivateRouter>
              <EditProjectUserRole />
            </PrivateRouter>
          } />
          <Route path="/no-access" element={<Noaccess />} />
          <Route path="*" element={<Notfound />} />
          <Route path="/projects" element={
            <PrivateRouter>
              <Projects />
            </PrivateRouter>
          } />
          <Route path="/create-project-form" element={
            <PrivateRouter>
              <CreateProjectForm />
            </PrivateRouter>
          } />
          <Route path="/my-projects" element={
            <PrivateRouter>
              <Myprojects />
            </PrivateRouter>
          } />
          <Route path="/add-environment/:projectId" element={
            <PrivateRouter>
              <AddEnvironmentForm />
            </PrivateRouter>
          } />

          <Route path='/test' element={<Modaltest />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
