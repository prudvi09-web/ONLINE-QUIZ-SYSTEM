import React, { useState, useEffect } from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  Award,
  Sparkles
} from 'lucide-react';
import { attemptApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function MyAttempts({ setActivePage, setLastResultId }) {
  const { isAuthenticated } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setActivePage('login');
      return;
    }

    async function loadHistory() {
      try {
        const data = await attemptApi.getMyHistory();
        setAttempts(data);
      } catch (err) {
        console.error('Failed to load user attempts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [isAuthenticated]);

  const viewAttemptDetail = (attemptId) => {
    setLastResultId(attemptId);
    setActivePage('quiz-result');
  };

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.passed).length;
  const averagePercentage = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
          <History className="w-4 h-4" /> Personal Performance
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Quiz History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your past assessments, test scores, and review question explanations.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalAttempts}</div>
            <div className="text-xs text-slate-500 font-medium">Total Assessments Taken</div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{passedAttempts}</div>
            <div className="text-xs text-slate-500 font-medium">Passed Assessments</div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{averagePercentage}%</div>
            <div className="text-xs text-slate-500 font-medium">Overall Average Score</div>
          </div>
        </div>
      </div>

      {/* Attempts Table / List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">Loading attempts...</div>
      ) : attempts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No attempts yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't participated in any quizzes yet. Explore our assessment catalog to test your skills!
          </p>
          <button
            onClick={() => setActivePage('quizzes')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5"
          >
            Explore Quizzes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Assessment</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Time Spent</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {attempts.map((att) => {
                  const minutes = Math.floor(att.timeTakenSeconds / 60);
                  const seconds = att.timeTakenSeconds % 60;
                  return (
                    <tr key={att.attemptId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {att.quizTitle}
                        <div className="text-xs font-normal text-slate-400 mt-0.5">
                          {att.categoryName}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-700">
                        {att.totalScore} / {att.maxScore}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
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
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {minutes}m {seconds}s
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => viewAttemptDetail(att.attemptId)}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          Review Answers
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
