import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import ClassesPage from './pages/ClassesPage';
import StudentsPage from './pages/StudentsPage';
import PedagogicalRecordsPage from './pages/PedagogicalRecordsPage';
import QuestionsPage from './pages/QuestionsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import SchoolsPage from './pages/SchoolsPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/records" element={<PedagogicalRecordsPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;