import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import PatientList from './components/Patients/PatientList';
import AppointmentList from './components/Appointments/AppointmentList';
import CalendarView from './components/Calendar/CalendarView';
import PatientAppointments from './components/Patient/PatientAppointments';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        {/* Admin Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patients" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <PatientList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <AppointmentList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <CalendarView />
            </ProtectedRoute>
          } 
        />

        {/* Patient Routes */}
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute requiredRole="Patient">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-appointments" 
          element={
            <ProtectedRoute requiredRole="Patient">
              <PatientAppointments />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect based on role */}
        <Route 
          path="/" 
          element={
            <Navigate 
              to={user?.role === 'Admin' ? '/dashboard' : '/patient-dashboard'} 
              replace 
            />
          } 
        />

        {/* Unauthorized page */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;