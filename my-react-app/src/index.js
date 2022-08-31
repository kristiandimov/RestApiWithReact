import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'
import {BrowserRouter as Router} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
);
