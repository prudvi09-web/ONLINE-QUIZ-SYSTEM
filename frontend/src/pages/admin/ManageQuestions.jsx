import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  HelpCircle, 
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { quizApi } from '../../api/client';

export default function ManageQuestions({ quizId, setActivePage }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
    explanation: '',
    marks: 1
  });

  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  async function loadQuizData() {
    try {
      const data = await quizApi.getAdminById(quizId);
      setQuiz(data);
    } catch (err) {
      console.error('Failed to load quiz details:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A',
      explanation: '',
      marks: 1
    });
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      explanation: q.explanation || '',
      marks: q.marks || 1
    });
    setModalError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalError('');
    setSaving(true);

    try {
      if (editingQuestion) {
        await quizApi.updateQuestion(editingQuestion.id, formData);
      } else {
        await quizApi.addQuestion(quizId, formData);
      }
      setShowModal(false);
      loadQuizData();
    } catch (err) {
      setModalError(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await quizApi.deleteQuestion(questionId);
      loadQuizData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 font-medium">Loading questions...</div>;
  }

  if (!quiz) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Quiz Not Found</h3>
        <button
          onClick={() => setActivePage('admin-quizzes')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const questions = quiz.questions || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActivePage('admin-quizzes')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800 inline-flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Quizzes
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {quiz.title}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {questions.length} Questions
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Category: <span className="font-semibold text-slate-700">{quiz.categoryName}</span> • Pass: {quiz.passingPercentage}% • Time: {quiz.durationMinutes}m
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Question List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No questions yet</h3>
          <p className="text-sm text-slate-500 mt-1">Click "Add Question" to build your assessment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const options = [
              { letter: 'A', text: q.optionA },
              { letter: 'B', text: q.optionB },
              { letter: 'C', text: q.optionC },
              { letter: 'D', text: q.optionD },
            ];

            return (
              <div
                key={q.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(q)}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {q.questionText}
                </h3>

                {/* Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {options.map((opt) => {
                    const isCorrect = q.correctOption === opt.letter;
                    return (
                      <div
                        key={opt.letter}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-medium'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {opt.letter}
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        {isCorrect && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 text-xs text-violet-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-violet-900">Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows="3"
                  required
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter the question text here..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                />
              </div>

              {/* Options Inputs */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-slate-700">Answer Options & Correct Answer</label>
                
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <div key={letter} className="flex items-center gap-2">
                    <label className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                      formData.correctOption === letter ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                      <input
                        type="radio"
                        name="correctRadio"
                        checked={formData.correctOption === letter}
                        onChange={() => setFormData({ ...formData, correctOption: letter })}
                        className="sr-only"
                      />
                      {letter}
                    </label>

                    <input
                      type="text"
                      required
                      value={formData[`option${letter}`]}
                      onChange={(e) => setFormData({ ...formData, [`option${letter}`]: e.target.value })}
                      placeholder={`Option ${letter} text`}
                      className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <span className="text-[11px] text-slate-400 w-16 text-right">
                      {formData.correctOption === letter ? 'Correct' : ''}
                    </span>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 mt-1">
                  * Click on the letter pill (A/B/C/D) to select it as the correct answer.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marks Weight</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Explanation (Shown after test)</label>
                  <input
                    type="text"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Why this answer is correct..."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
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
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
