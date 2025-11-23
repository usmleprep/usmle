import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateTest from './components/CreateTest';
import TestInterface from './components/TestInterface';
import TestHistory from './components/TestHistory';
import TestReview from './components/TestReview';
import Login from './components/Login';
import { getSession } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const session = getSession();
    setIsAuthenticated(!!session);
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (email) => {
    console.log('User logged in:', email);
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
    <Router>
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
