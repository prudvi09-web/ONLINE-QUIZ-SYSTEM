import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizTake from './pages/QuizTake';
import QuizResult from './pages/QuizResult';
import MyAttempts from './pages/MyAttempts';
import Leaderboard from './pages/Leaderboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import ManageQuestions from './pages/admin/ManageQuestions';
import ManageCategories from './pages/admin/ManageCategories';
import AdminResults from './pages/admin/AdminResults';

function MainApp() {
  const [activePage, setActivePage] = useState('home');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [lastResultId, setLastResultId] = useState(null);
  const [selectedAdminQuizId, setSelectedAdminQuizId] = useState(null);

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home 
            setActivePage={setActivePage} 
            setSelectedQuizId={setSelectedQuizId} 
          />
        );
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'register':
        return <Register setActivePage={setActivePage} />;
      case 'quizzes':
        return (
          <QuizList 
            setActivePage={setActivePage} 
            setSelectedQuizId={setSelectedQuizId} 
          />
        );
      case 'quiz-take':
        return (
          <QuizTake 
            quizId={selectedQuizId} 
            setActivePage={setActivePage} 
            setLastResultId={setLastResultId} 
          />
        );
      case 'quiz-result':
        return (
          <QuizResult 
            attemptId={lastResultId} 
            setActivePage={setActivePage} 
            setSelectedQuizId={setSelectedQuizId} 
          />
        );
      case 'my-attempts':
        return (
          <MyAttempts 
            setActivePage={setActivePage} 
            setLastResultId={setLastResultId} 
          />
        );
      case 'leaderboard':
        return <Leaderboard setActivePage={setActivePage} />;

      // Admin portal routes
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            setActivePage={setActivePage} 
            setSelectedAdminQuizId={setSelectedAdminQuizId} 
          />
        );
      case 'admin-quizzes':
        return (
          <ManageQuizzes 
            setActivePage={setActivePage} 
            setSelectedAdminQuizId={setSelectedAdminQuizId} 
          />
        );
      case 'admin-questions':
        return (
          <ManageQuestions 
            quizId={selectedAdminQuizId} 
            setActivePage={setActivePage} 
          />
        );
      case 'admin-categories':
        return <ManageCategories setActivePage={setActivePage} />;
      case 'admin-results':
        return (
          <AdminResults 
            setActivePage={setActivePage} 
            setLastResultId={setLastResultId} 
          />
        );

      default:
        return (
          <Home 
            setActivePage={setActivePage} 
            setSelectedQuizId={setSelectedQuizId} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Hide standard navbar during active quiz taking for distraction-free focus */}
      {activePage !== 'quiz-take' && (
        <Navbar activePage={activePage} setActivePage={setActivePage} />
      )}

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {activePage !== 'quiz-take' && (
        <Footer setActivePage={setActivePage} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
