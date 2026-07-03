import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SchoolsPage from './pages/SchoolsPage';
import ClassesPage from './pages/ClassesPage';
import StudentsPage from './pages/StudentsPage';
import PedagogicalRecordsPage from './pages/PedagogicalRecordsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import QuestionsPage from './pages/QuestionsPage';
import BNCCPage from './pages/BNCCPage';
import LoginPage from './pages/LoginPage';
import { getStoredToken } from './utils/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(Boolean(getStoredToken()));

    syncAuthState();
    window.addEventListener('auth:change', syncAuthState);

    return () => window.removeEventListener('auth:change', syncAuthState);
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {isAuthenticated ? (
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/schools" element={<SchoolsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/records" element={<PedagogicalRecordsPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/bncc" element={<BNCCPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
