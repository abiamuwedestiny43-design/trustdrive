
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import DriverLogin from './pages/DriverLogin';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import Drivers from './pages/admin/Drivers';
import Fleet from './pages/admin/Fleet';
import Settings from './pages/admin/Settings';
import Setup from './pages/Setup';
import Profile from './pages/Profile';
import Community from './pages/Community';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="driver-login" element={<DriverLogin />} />
        <Route path="admin-login" element={<Login />} />
        <Route path="driver-dashboard" element={<DriverDashboard />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="setup" element={<Setup />} />
        <Route path="community" element={<Community />} />
      </Route>
    </Routes>
  );
}

export default App;
