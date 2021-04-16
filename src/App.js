// import firebase from './services/firebaseConection';

import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/auth';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes />
        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
