import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

import Layout from './components/layout/layout';
import { AuthProvider } from './context/authContext'; // ⭐ IMPORTANTE
import PrivateRoute from './components/privateRoutes/privateRoutes'; // ⭐ IMPORTANTE

// PAGES
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import UsersList from './pages/user/userList';
import UsersCreate from './pages/user/userCreate';
import Home from './pages/home/home';
import HoursMark from './pages/hours/hoursMark';
import HoursHistory from './pages/hours/hoursHistory';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <Router>
      <Layout>
        <Routes>
            <Route path="/" element={<Home />} />
          {/* ---------- LOGIN ----------- */}
          <Route path="/login" element={<Login />} />

          {/* ---------- RUTAS PROTEGIDAS ----------- */}
         <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute roles={["admin"]}>
                <UsersList/>
              </PrivateRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <PrivateRoute roles={["admin"]}>
                <UsersCreate />
              </PrivateRoute>
            }
          />

          <Route
            path="/hours/mark"
            element={
              <PrivateRoute roles={["admin"]}>
                <HoursMark />
              </PrivateRoute>
            }
          />
           <Route
            path="/hours/history"
            element={
              <PrivateRoute roles={["admin"]}>
                <HoursHistory />
              </PrivateRoute>
            }
          />


        </Routes>
      </Layout>
    </Router>
  </AuthProvider>
);
