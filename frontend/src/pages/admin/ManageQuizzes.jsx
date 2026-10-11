import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  Clock, 
  Award, 
  ArrowLeft, 
  Search, 
  Check, 
  X,
  BookOpen
} from 'lucide-react';
import { quizApi, categoryApi } from '../../api/client';
import DifficultyBadge from '../../components/DifficultyBadge';

export default function ManageQuizzes({ setActivePage, setSelectedAdminQuizId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    durationMinutes: 15,
    passingPercentage: 60,
    difficulty: 'MEDIUM',
    active: true
  });
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [quizList, catList] = await Promise.all([
        quizApi.getAdminAll(),
        categoryApi.getAll()
      ]);
      setQuizzes(quizList);
      setCategories(catList);
      if (catList.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load admin quizzes:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      durationMinutes: 15,
      passingPercentage: 60,
      difficulty: 'MEDIUM',
      active: true
    });
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description || '',
      categoryId: quiz.categoryId,
      durationMinutes: quiz.durationMinutes,
      passingPercentage: quiz.passingPercentage,
      difficulty: quiz.difficulty,
      active: quiz.active
    });
    setModalError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalError('');
    setSaving(true);

    try {
      if (editingQuiz) {
        await quizApi.update(editingQuiz.id, formData);
      } else {
        await quizApi.create(formData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setModalError(err.message || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz and all its questions?')) return;
    try {
      await quizApi.delete(quizId);
      loadData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleManageQuestions = (quizId) => {
    setSelectedAdminQuizId(quizId);
    setActivePage('admin-questions');
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    (q.categoryName && q.categoryName.toLowerCase().includes(search.toLowerCase()))
  );

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
            Manage Quizzes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, update, and organize quizzes and assign them to categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes by title or category..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
        />
      </div>

      {/* Quizzes Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">Loading quizzes...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No quizzes found</h3>
          <p className="text-sm text-slate-500 mt-1">Create your first quiz to start adding questions.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Quiz Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Questions</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Pass Mark</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{quiz.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{quiz.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {quiz.categoryName}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleManageQuestions(quiz.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {quiz.totalQuestions} Questions &rarr;
                      </button>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                      {quiz.durationMinutes} mins
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {quiz.passingPercentage}%
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        quiz.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {quiz.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleManageQuestions(quiz.id)}
                          title="Manage Questions"
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(quiz)}
                          title="Edit Quiz"
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
                          title="Delete Quiz"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Core Java Mastery"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of topics covered..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time (mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pass Mark %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.passingPercentage}
                    onChange={(e) => setFormData({ ...formData, passingPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <label htmlFor="activeCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Publish Quiz (Active for students to participate)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs shadow-md shadow-violet-600/30"
                >
                  {saving ? 'Saving...' : 'Save Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
