import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import { LoginForm, SignupForm } from './components/AuthForm';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
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
              <LoginForm onLoginSuccess={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <SignupForm onSignupSuccess={() => {}} />
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
          element={<InfoPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
