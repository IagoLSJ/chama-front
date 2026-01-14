import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PassageirosProvider } from './contexts/PassageirosContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import DetalhePage from './pages/DetalhePage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import BusesPage from './pages/admin/BusesPage';
import RoutesPage from './pages/admin/RoutesPage';
import TravelsPage from './pages/admin/TravelsPage';
import CallPage from './pages/responsible/CallPage';
import StudentTravelsPage from './pages/student/TravelsPage';

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated, isAdmin, isResponsible, isStudent } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      
      {/* Rotas Públicas */}
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/detalhe/:id" element={<DetalhePage />} />
      
      {/* Dashboard - Acessível para todos autenticados */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* Rotas Admin */}
      <Route 
        path="/admin/usuarios" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/onibus" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <BusesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rotas" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <RoutesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/viagens" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <TravelsPage />
          </ProtectedRoute>
        } 
      />

      {/* Rotas Responsável */}
      <Route 
        path="/responsavel/chamada" 
        element={
          <ProtectedRoute allowedRoles={['RESPONSIBLE', 'ADMIN']}>
            <CallPage />
          </ProtectedRoute>
        } 
      />

      {/* Rotas Estudante */}
      <Route 
        path="/estudante/viagens" 
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentTravelsPage />
          </ProtectedRoute>
        } 
      />

      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PassageirosProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PassageirosProvider>
    </AuthProvider>
  );
}