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
import HoursHistory from './pages/hours/hoursHistory';
import AdminInventory from './pages/inventory/inventory';
import ClinicalHistory from './components/ClinicalHistory/ClinicalHistory';
import { Provider } from 'react-redux';
import { store } from "./redux/store";
import ReportsByUser from './pages/roports/reportsbyuser';
// import ReportsGeneral from './pages/roports/reportsGeneral';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UsersList/>} />
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
            {/* <Route
              path="/users"
              element={
                <PrivateRoute roles={["admin"]}>
                  <UsersList/>
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/users/create"
              element={
                <PrivateRoute roles={["admin"]}>
                  <UsersCreate />
                </PrivateRoute>
              }
            />

             <Route
              path="/reports"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ReportsByUser />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/reports/general"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ReportsGeneral />
                </PrivateRoute>
              }
            /> */}

             {/* <Route
              path="/users/edit/:id"
              element={
                <PrivateRoute roles={["admin"]}>
                  <UsersEdit />
                </PrivateRoute>
              }
            /> */}

            {/* <Route
              path="/hours/mark"
              element={
                <PrivateRoute roles={["admin"]}>
                  <HoursHistory />
                </PrivateRoute>
              } */}
            {/* /> */}
            <Route
              path="/hours/history"
              element={
                <PrivateRoute roles={["admin"]}>
                  <HoursHistory />
                </PrivateRoute>
              }
            />

            <Route
              path="/inventory"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminInventory />
                </PrivateRoute>
              }
            />
  ClinicalHistory
            <Route
              path="/ClinicalHistory"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ClinicalHistory />
                </PrivateRoute>
              }
            />

          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  </Provider>
);
