import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import PapersPage from './pages/PapersPage';
import CriteriaPage from './pages/CriteriaPage';
import './index.css';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === 'success' ? '✅' : '❌'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export const ToastContext = React.createContext(null);

function App() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return (
    <ToastContext.Provider value={addToast}>
      <BrowserRouter>
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <div className="logo-icon">📝</div>
            QPGen AI
          </Link>
          <div className="navbar-nav">
            <NavLink to="/generate" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              ✨ Generate
            </NavLink>
            <NavLink to="/papers" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              📄 Papers
            </NavLink>
            <NavLink to="/criteria" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              ⚙️ Criteria
            </NavLink>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/criteria" element={<CriteriaPage />} />
        </Routes>

        <Toast toasts={toasts} />
      </BrowserRouter>
    </ToastContext.Provider>
  );
}

export default App;
