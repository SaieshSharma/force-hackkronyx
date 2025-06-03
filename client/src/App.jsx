import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes';
import { Toaster } from 'react-hot-toast';
import './index.css';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  return (
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
  );
};

export default App;
