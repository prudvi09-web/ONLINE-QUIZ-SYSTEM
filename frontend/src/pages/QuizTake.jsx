import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  CheckCircle, 
  AlertTriangle, 
  Check, 
  Send,
  HelpCircle
} from 'lucide-react';
import { quizApi, attemptApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function QuizTake({ quizId, setActivePage, setLastResultId }) {
  const { isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: "A" | "B" | "C" | "D" }
  const [flagged, setFlagged] = useState({}); // { [questionId]: boolean }
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setActivePage('login');
      return;
    }

    async function loadQuiz() {
      try {
        const data = await quizApi.getForTaking(quizId);
        setQuiz(data);
        const totalSec = (data.durationMinutes || 15) * 60;
        setSecondsRemaining(totalSec);
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      loadQuiz();
    }
  }, [quizId, isAuthenticated]);

  // Timer countdown
  useEffect(() => {
    if (!quiz || secondsRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quiz]);

  const handleAutoSubmit = () => {
    submitQuizInternal();
  };

  const handleSelectOption = (questionId, optionLetter) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  const handleClearOption = (questionId) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const submitQuizInternal = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const res = await attemptApi.submit({
        quizId: quiz.id,
        timeTakenSeconds: timeTaken,
        answers: answers
      });
      setLastResultId(res.attemptId);
      setActivePage('quiz-result');
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-600">Preparing assessment session...</p>
      </div>
    );
  }

  if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Cannot Start Quiz</h3>
        <p className="text-sm text-slate-500 mt-2">{error || 'This quiz currently has no questions available.'}</p>
        <button
          onClick={() => setActivePage('quizzes')}
          className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
        >
          Return to Quizzes
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Format mm:ss
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = secondsRemaining < 120; // less than 2 minutes

  const options = [
    { letter: 'A', text: currentQuestion.optionA },
    { letter: 'B', text: currentQuestion.optionB },
    { letter: 'C', text: currentQuestion.optionC },
    { letter: 'D', text: currentQuestion.optionD },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      
      {/* Sticky Quiz Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {quiz.categoryName} Assessment
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
              {quiz.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
              isTimeCritical 
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>{timeFormatted}</span>
            </div>

            {/* Finish Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Submit Quiz</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>

        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Taking Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Question Workspace (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              
              {/* Question Meta Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                  </span>

                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      flagged[currentQuestion.id]
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-6">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
              </div>

              {/* MCQ Options A, B, C, D */}
              <div className="space-y-3">
                {options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.letter;
                  return (
                    <div
                      key={opt.letter}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.letter)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {opt.letter}
                        </div>
                        <span className={`text-sm sm:text-base font-medium ${
                          isSelected ? 'text-indigo-950 font-semibold' : 'text-slate-800'
                        }`}>
                          {opt.text}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {answers[currentQuestion.id] && (
                    <button
                      onClick={() => handleClearOption(currentQuestion.id)}
                      className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs sm:text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Finish & Submit
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Question Palette Sidebar (1 col) */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-slate-900 text-sm">Question Navigation</h3>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-indigo-600"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-amber-400"></div>
                  <span>Flagged ({flaggedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-slate-100 border border-slate-300"></div>
                  <span>Unanswered ({totalQuestions - answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md ring-2 ring-indigo-600 bg-white"></div>
                  <span>Current</span>
                </div>
              </div>

              {/* Palette Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answers[q.id];
                  const isFlagged = !!flagged[q.id];

                  let style = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (isAnswered) style = 'bg-indigo-600 text-white';
                  if (isFlagged) style = 'bg-amber-400 text-slate-900 font-bold';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${style} ${
                        isCurrent ? 'ring-2 ring-offset-2 ring-indigo-600 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit All Answers
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center">Ready to Submit?</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Once submitted, your answers will be automatically evaluated and your score finalized.
            </p>

            <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-indigo-600 text-base">{answeredCount}</div>
                <div className="text-[10px] text-slate-400">Answered</div>
              </div>
              <div>
                <div className="font-bold text-amber-600 text-base">{flaggedCount}</div>
                <div className="text-[10px] text-slate-400">Flagged</div>
              </div>
              <div>
                <div className="font-bold text-rose-600 text-base">{totalQuestions - answeredCount}</div>
                <div className="text-[10px] text-slate-400">Skipped</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
              >
                Review Answers
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={submitQuizInternal}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
