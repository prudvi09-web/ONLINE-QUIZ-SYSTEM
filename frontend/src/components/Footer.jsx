import React from 'react';
import { GraduationCap, Heart, Sparkles } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">QuizHub Assessment Platform</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              A comprehensive digital evaluation engine built according to the Online Quiz System specification.
              Featuring automated scoring, dynamic question navigation, instant result reviews, and administrator controls.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Spring Boot & React Architecture
              </span>
              <span>•</span>
              <span>RESTful APIs</span>
              <span>•</span>
              <span>H2/MySQL Ready</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => setActivePage('quizzes')} className="hover:text-indigo-600 transition-colors">
                  All Quizzes
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('leaderboard')} className="hover:text-indigo-600 transition-colors">
                  Top Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('my-attempts')} className="hover:text-indigo-600 transition-colors">
                  My History
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Admin Access</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => setActivePage('admin-dashboard')} className="hover:text-indigo-600 transition-colors">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin-quizzes')} className="hover:text-indigo-600 transition-colors">
                  Manage Quizzes
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin-categories')} className="hover:text-indigo-600 transition-colors">
                  Manage Categories
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin-results')} className="hover:text-indigo-600 transition-colors">
                  Student Results
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Online Quiz System. Built with Spring Boot & React.</p>
          <div className="flex items-center gap-1">
            <span>Designed for digital education, corporate training & skill assessment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
