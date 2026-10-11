import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { adminApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard({ setActivePage, setSelectedAdminQuizId }) {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsData, attemptsData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getAllAttempts()
        ]);
        setStats(statsData);
        setRecentAttempts(attemptsData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">
            <ShieldCheck className="w-4 h-4" /> Administration Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Quiz Management Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage quizzes, categories, questions, and view global student results.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('admin-quizzes')}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Manage Quizzes
          </button>
          <button
            onClick={() => setActivePage('admin-categories')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-violet-600" />
            Categories
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Quizzes</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.totalQuizzes || 0}</div>
          <div className="text-xs text-slate-500 mt-1">{stats?.totalQuestions || 0} total questions</div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
            <Layers className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.totalCategories || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Organized topics</div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Submissions</span>
            <ClipboardList className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.totalAttempts || 0}</div>
          <div className="text-xs text-slate-500 mt-1">{stats?.passRate || 0}% overall pass rate</div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Score</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats?.averageScore || 0}%</div>
          <div className="text-xs text-slate-500 mt-1">{stats?.totalUsers || 0} registered users</div>
        </div>

      </div>

      {/* Management Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          onClick={() => setActivePage('admin-quizzes')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-violet-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-violet-700 transition-colors">
              Manage Quizzes & Questions
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Create tests, configure time duration, passing mark percentage, add and edit multiple-choice questions with answers.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-700">
            <span>Configure Quizzes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActivePage('admin-categories')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-violet-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-sky-700 transition-colors">
              Manage Quiz Categories
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Create, update, and organize categories such as Java Programming, Web Development, Database, and Algorithms.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700">
            <span>Manage Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActivePage('admin-results')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 hover:border-violet-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
              View User Results
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Inspect participant evaluation results, auto-computed scores, pass/fail status, and detailed answer responses.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Audit User Scores</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 text-lg">Recent Quiz Submissions</h2>
          <button
            onClick={() => setActivePage('admin-results')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800"
          >
            View all results &rarr;
          </button>
        </div>

        {recentAttempts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No quiz submissions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Quiz</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttempts.map((att) => (
                  <tr key={att.attemptId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{att.userName}</td>
                    <td className="py-3 px-4 text-slate-600">{att.quizTitle}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{att.totalScore}/{att.maxScore}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{att.percentage}%</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        att.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {att.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
