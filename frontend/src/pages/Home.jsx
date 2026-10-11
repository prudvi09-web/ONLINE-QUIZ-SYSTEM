import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  BookOpen, 
  Zap, 
  BarChart3, 
  Users,
  Compass,
  Code,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import { categoryApi, quizApi } from '../api/client';
import DifficultyBadge from '../components/DifficultyBadge';

export default function Home({ setActivePage, setSelectedQuizId }) {
  const [categories, setCategories] = useState([]);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, quizzes] = await Promise.all([
          categoryApi.getAll().catch(() => []),
          quizApi.getActive().catch(() => [])
        ]);
        setCategories(cats);
        setFeaturedQuizzes(quizzes.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCategoryIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('java') || lower.includes('code')) return <Code className="w-6 h-6 text-indigo-600" />;
    if (lower.includes('web')) return <Globe className="w-6 h-6 text-sky-600" />;
    if (lower.includes('data structure') || lower.includes('algorithm')) return <Cpu className="w-6 h-6 text-purple-600" />;
    return <Database className="w-6 h-6 text-amber-600" />;
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-indigo-50/60 via-white to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-medium mb-6 animate-pulse-subtle">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Digital Online Quiz & Assessment System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Conduct, Take & Evaluate <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
              Quizzes in Real-Time
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate manual grading with instant automated score calculations. Features comprehensive question navigation, multi-category management, and administrator controls.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActivePage('quizzes')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5" />
              Explore All Quizzes
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActivePage('leaderboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-amber-500" />
              View Leaderboard
            </button>
          </div>

          {/* Quick Demo Credentials Pill Card */}
          <div className="mt-12 max-w-2xl mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                Pre-configured Test Accounts
              </span>
              <span className="text-xs text-indigo-600 font-medium">Ready to use</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-600" /> Administrator
                </div>
                <div className="text-slate-600 mt-1 font-mono">admin@quiz.com / admin123</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Manage quizzes, categories & view student scores</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" /> Student / Participant
                </div>
                <div className="text-slate-600 mt-1 font-mono">user@quiz.com / user123</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Take quizzes, view scores & attempt history</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Curated Disciplines</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Browse by Category</h2>
          </div>
          <button
            onClick={() => setActivePage('quizzes')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 mt-2 md:mt-0"
          >
            All categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActivePage('quizzes')}
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>{cat.quizCount || 0} active {cat.quizCount === 1 ? 'quiz' : 'quizzes'}</span>
                <span className="text-indigo-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Start <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Quizzes */}
      {featuredQuizzes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Popular Tests</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Assessments</h2>
            </div>
            <button
              onClick={() => setActivePage('quizzes')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 mt-2 md:mt-0"
            >
              View catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                      {quiz.categoryName}
                    </span>
                    <DifficultyBadge difficulty={quiz.difficulty} />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {quiz.description}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-xl text-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{quiz.totalQuestions}</div>
                      <div className="text-[10px] text-slate-400">Questions</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{quiz.durationMinutes}m</div>
                      <div className="text-[10px] text-slate-400">Duration</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{quiz.passingPercentage}%</div>
                      <div className="text-[10px] text-slate-400">Pass Req.</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedQuizId(quiz.id);
                      setActivePage('quiz-take');
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Abstract Specifications Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">System Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Engineered to Match Specifications</h2>
            <p className="text-sm text-slate-300 mt-2">
              Designed according to the digital assessment abstract requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <Zap className="w-8 h-8 text-amber-400 mb-3" />
              <h4 className="font-semibold text-base mb-1">Automatic Evaluation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scores and percentages calculated instantaneously upon quiz submission with zero delay.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-8 h-8 text-indigo-400 mb-3" />
              <h4 className="font-semibold text-base mb-1">Dual Role Access</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated interfaces for Administrators (CRUD operations) and Users (participating in quizzes).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-8 h-8 text-sky-400 mb-3" />
              <h4 className="font-semibold text-base mb-1">Timed Navigation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time countdown timer, question palette jump, mark for review, and auto-submit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <BarChart3 className="w-8 h-8 text-emerald-400 mb-3" />
              <h4 className="font-semibold text-base mb-1">Detailed Explanations</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full answer review breakdown showing correct vs selected choices and educational explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
