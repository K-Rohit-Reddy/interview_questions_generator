import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import { LoginForm, SignupForm } from './components/AuthForm';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import QuestionForm from './components/QuestionForm';
import InterviewHistory from './components/InterviewHistory';
import TermsOfService from './components/termsofservice';
import PrivacyPolicy from './components/privacypolicy';
import FeedbackForm from './components/FeedbackForm'; // import your new component
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
        {/* Public authentication routes with header buttons hidden */}
        <Route
          path="/login"
          element={
            <Layout
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              headerAuthButtons={false}
            >
              {isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginForm onLoginSuccess={handleLogin} />
              )}
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              headerAuthButtons={false}
            >
              {isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <SignupForm onSignupSuccess={() => {}} />
              )}
            </Layout>
          }
        />

        {/* Authenticated routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <LandingPage onStartClick={() => (window.location.href = '/generate')} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/generate"
          element={
            isAuthenticated ? (
              <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <QuestionForm />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/history"
          element={
            isAuthenticated ? (
              <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                <InterviewHistory onLogout={handleLogout} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public informational routes */}
        <Route
          path="/terms-of-service"
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <TermsOfService />
            </Layout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/feedback"  // New route for feedback form
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <FeedbackForm />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
              <InfoPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
