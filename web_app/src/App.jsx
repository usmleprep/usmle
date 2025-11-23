import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateTest from './components/CreateTest';
import TestInterface from './components/TestInterface';
import TestHistory from './components/TestHistory';
import TestReview from './components/TestReview';
import Login from './components/Login';
import { isEmailAuthorized } from './config/authorizedEmails';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const authenticated = localStorage.getItem('usmle_authenticated') === 'true';
    const storedEmail = localStorage.getItem('usmle_user_email');

    // Validate that the stored email is still authorized
    if (authenticated && storedEmail && isEmailAuthorized(storedEmail)) {
      setIsAuthenticated(true);
    } else {
      // Clear invalid session
      localStorage.removeItem('usmle_authenticated');
      localStorage.removeItem('usmle_user_email');
      localStorage.removeItem('usmle_session_time');
      setIsAuthenticated(false);
    }

    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router basename="/usmle">
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/test" element={<TestInterface />} />
          <Route path="/history" element={<TestHistory />} />
          <Route path="/review/:testId" element={<TestReview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
