import Dashboard from './pages/Dashboard';
import MachineListPage from './pages/MachineListPage';
import { Route } from 'react-router-dom';

const routes = [
 { path: "/", element: <MachineListPage /> }, // ✅ Plain object, not <Route> component
 { path: "/machines", element: <MachineListPage /> },
{ path: "/dashboard/:machineId", element: <Dashboard /> }
]

export default routes;
