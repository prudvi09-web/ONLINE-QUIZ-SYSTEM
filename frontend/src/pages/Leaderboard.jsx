import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { attemptApi } from '../api/client';

export default function Leaderboard({ setActivePage }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await attemptApi.getLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
          3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
        {rank}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <Trophy className="w-4 h-4 text-amber-500" /> Top Performers
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Global Assessment Leaderboard
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Rankings based on highest percentage scores and fastest completion time.
        </p>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">Loading rankings...</div>
      ) : leaders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No leaderboard entries yet</h3>
          <p className="text-sm text-slate-500 mt-1">Be the first to complete a quiz and claim rank #1!</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6 w-16 text-center">Rank</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Assessment</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Points</th>
                  <th className="py-4 px-6 text-right">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {leaders.map((leader, index) => {
                  const rank = index + 1;
                  const minutes = Math.floor(leader.timeTakenSeconds / 60);
                  const seconds = leader.timeTakenSeconds % 60;

                  return (
                    <tr 
                      key={leader.attemptId} 
                      className={`hover:bg-slate-50/60 transition-colors ${
                        rank === 1 ? 'bg-amber-50/30' : rank === 2 ? 'bg-slate-50/30' : rank === 3 ? 'bg-orange-50/20' : ''
                      }`}
                    >
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center">
                          {getRankBadge(rank)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{leader.userName}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium text-xs sm:text-sm">
                        {leader.quizTitle}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-indigo-600 text-base">
                          {leader.percentage}%
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700 text-xs sm:text-sm">
                        {leader.score} / {leader.maxScore}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs text-right font-mono">
                        {minutes}m {seconds}s
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
