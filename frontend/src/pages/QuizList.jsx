import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { quizApi, categoryApi } from '../api/client';
import DifficultyBadge from '../components/DifficultyBadge';

export default function QuizList({ setActivePage, setSelectedQuizId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        const [quizList, catList] = await Promise.all([
          quizApi.getActive(),
          categoryApi.getAll()
        ]);
        setQuizzes(quizList);
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load quizzes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quiz.categoryName && quiz.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'ALL' || 
      quiz.categoryId === Number(selectedCategory);

    const matchesDifficulty = 
      selectedDifficulty === 'ALL' || 
      quiz.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleStartQuiz = (id) => {
    setSelectedQuizId(id);
    setActivePage('quiz-take');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" /> Assessment Catalog
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Available Quizzes
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Choose from tests across multiple domains. Test your competency with immediate grading and detailed feedback.
          </p>
        </div>

        <div className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900 font-bold">{filteredQuizzes.length}</span> of {quizzes.length} assessments
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, language or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Difficulty filter */}
          <div className="sm:w-48">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id.toString()
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No quizzes found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or category filters to find available tests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300 transition-all group"
            >
              <div>
                {/* Badges top */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {quiz.categoryName}
                  </span>
                  <DifficultyBadge difficulty={quiz.difficulty} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {quiz.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {quiz.description || 'No description provided.'}
                </p>

                {/* Specs Box */}
                <div className="mt-5 grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50/90 rounded-2xl text-center border border-slate-100">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{quiz.totalQuestions}</span>
                    <span className="text-[10px] block text-slate-400 font-medium">Questions</span>
                  </div>

                  <div className="border-x border-slate-200/60">
                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{quiz.durationMinutes}m</span>
                    <span className="text-[10px] block text-slate-400 font-medium">Time Limit</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{quiz.passingPercentage}%</span>
                    <span className="text-[10px] block text-slate-400 font-medium">Pass Mark</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
                >
                  Start Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
