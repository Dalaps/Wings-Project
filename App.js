import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import StockManagement from './StockManagement';
import UserManagement from './UserManagement';
import Login from './Login';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSection, setShowSection] = useState('login'); // Added to manage show section state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/check-session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(err => console.error('Error fetching session:', err));
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2 className="glow"><b>Welcome to Wings Cafe</b></h2>

        {currentUser && (
          <nav className="dashboard-buttons">
            <Link to="/dashboard"><button>Dashboard</button></Link>
            <Link to="/products"><button>Product Management</button></Link>
            <Link to="/stocks"><button>Stock Management</button></Link>
            <Link to="/users"><button>User Management</button></Link>
          </nav>
        )}
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setActiveUser={setCurrentUser} setShowSection={setShowSection} showSection={showSection} />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard activeUser={currentUser.username} /> : <Navigate to="/login" replace />} />
        <Route path="/products" element={currentUser ? <ProductManagement /> : <Navigate to="/login" replace />} />
        <Route path="/stocks" element={currentUser ? <StockManagement /> : <Navigate to="/login" replace />} />
        <Route path="/users" element={currentUser ? <UserManagement setActiveUser={setCurrentUser} /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;