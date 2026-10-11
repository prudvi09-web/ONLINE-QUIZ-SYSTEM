import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Trophy, 
  History, 
  Compass, 
  LogOut, 
  User, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                QuizHub
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs px-2 py-0.5 font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Online Assessment
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigate('quizzes')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'quizzes' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Quizzes
            </button>

            <button
              onClick={() => navigate('leaderboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'leaderboard' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>

            {isAuthenticated && (
              <button
                onClick={() => navigate('my-attempts')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activePage === 'my-attempts' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <History className="w-4 h-4" />
                My History
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => navigate('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activePage.startsWith('admin') 
                    ? 'text-violet-700 bg-violet-100 font-semibold' 
                    : 'text-violet-700 bg-violet-50 hover:bg-violet-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-violet-600" />
                Admin Portal
              </button>
            )}
          </nav>

          {/* User Auth Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 rounded-full border border-slate-200/60">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {isAdmin ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 rounded-lg transition-all"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => navigate('quizzes')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            <Compass className="w-5 h-5 text-indigo-600" />
            Explore Quizzes
          </button>
          <button
            onClick={() => navigate('leaderboard')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            Leaderboard
          </button>
          {isAuthenticated && (
            <button
              onClick={() => navigate('my-attempts')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              <History className="w-5 h-5 text-indigo-600" />
              My History
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate('admin-dashboard')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-violet-700 bg-violet-50"
            >
              <ShieldCheck className="w-5 h-5 text-violet-600" />
              Admin Portal
            </button>
          )}

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between px-2 pt-1">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => navigate('login')}
                  className="w-full py-2 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="w-full py-2 text-center text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
