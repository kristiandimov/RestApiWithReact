
import './App.css';
import React , {useContext} from 'react';
import {BrowserRouter ,Route, Routes} from "react-router-dom";
import Layout from './Pages/Layout';
import Login from './Pages/Login';
import Projects from './Pages/Project/Projects';
import Users from './Pages/Users/Users';
import Tasks from './Pages/Task/Tasks';
import Home from './Pages/Home';
import Navbar from './components/Navbar';
import ProtectedRoute from './utils/ProtectedRoute';

const App = () => {
  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<Layout/>}>
              <Route path="/" element={<Home />} exact ></Route>
              <Route path="login" element={<Login />}></Route>
              <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} ></Route>
              <Route path="projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} ></Route>
              <Route path="tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} ></Route>
            </Route>
      </Routes>
  </div>
  );
}

export default App;
