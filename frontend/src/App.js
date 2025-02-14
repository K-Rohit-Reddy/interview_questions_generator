import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import LandingPage from './components/LandingPage';
import QuestionForm from './components/QuestionForm';
import InterviewHistory from './components/InterviewHistory';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Layout showHeader={false}>
                <AuthForm onLoginSuccess={handleLogin} />
              </Layout>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <LandingPage onStartClick={() => window.location.href = '/generate'} />
              </Layout> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/generate" 
          element={
            isAuthenticated ? 
              <Layout onLogout={handleLogout}>
                <QuestionForm />
              </Layout> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/history" 
          element={
            isAuthenticated ? 
              <InterviewHistory onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;