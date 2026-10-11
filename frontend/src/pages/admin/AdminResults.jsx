import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ClipboardList,
  Clock,
  Filter
} from 'lucide-react';
import { adminApi } from '../../api/client';

export default function AdminResults({ setActivePage, setLastResultId }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadAttempts() {
      try {
        const data = await adminApi.getAllAttempts();
        setAttempts(data);
      } catch (err) {
        console.error('Failed to load user attempts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAttempts();
  }, []);

  const viewAttemptDetail = (attemptId) => {
    setLastResultId(attemptId);
    setActivePage('quiz-result');
  };

  const filteredAttempts = attempts.filter((att) => {
    const matchesSearch = 
      (att.userName && att.userName.toLowerCase().includes(search.toLowerCase())) ||
      (att.userEmail && att.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      (att.quizTitle && att.quizTitle.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'PASSED' && att.passed) ||
      (statusFilter === 'FAILED' && !att.passed);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActivePage('admin-dashboard')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800 inline-flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            User Assessment Results
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global evaluation records, automatic scores, and question breakdown review.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or quiz..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 font-medium cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PASSED">Passed Only</option>
            <option value="FAILED">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">Loading results...</div>
      ) : filteredAttempts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No attempts match filters</h3>
          <p className="text-sm text-slate-500 mt-1">Try resetting your search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Quiz Title</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Time Spent</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAttempts.map((att) => {
                  const minutes = Math.floor(att.timeTakenSeconds / 60);
                  const seconds = att.timeTakenSeconds % 60;
                  return (
                    <tr key={att.attemptId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{att.userName}</div>
                        <div className="text-xs text-slate-400">{att.userEmail}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {att.quizTitle}
                        <div className="text-xs font-normal text-slate-400 mt-0.5">{att.categoryName}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-700">
                        {att.totalScore} / {att.maxScore}
                      </td>
                      <td className="py-4 px-6 font-black text-slate-900">
                        {att.percentage}%
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          att.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {att.passed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs font-mono">
                        {minutes}m {seconds}s
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => viewAttemptDetail(att.attemptId)}
                          className="px-3.5 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          View Breakdown
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
