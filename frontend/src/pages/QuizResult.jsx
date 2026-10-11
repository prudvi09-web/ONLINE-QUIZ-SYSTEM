import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  HelpCircle,
  Award,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { attemptApi } from '../api/client';

export default function QuizResult({ attemptId, setActivePage, setSelectedQuizId }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('ALL'); // 'ALL' | 'CORRECT' | 'INCORRECT' | 'SKIPPED'

  useEffect(() => {
    async function loadResult() {
      try {
        const data = await attemptApi.getById(attemptId);
        setResult(data);

        // Confetti celebration if passed!
        if (data.passed) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore confetti error if unsupported
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    }

    if (attemptId) {
      loadResult();
    }
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-600">Calculating automated score & results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Result Not Found</h3>
        <p className="text-sm text-slate-500 mt-2">{error || 'Could not retrieve attempt results.'}</p>
        <button
          onClick={() => setActivePage('quizzes')}
          className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // Filter question answers
  const filteredAnswers = (result.answers || []).filter((ans) => {
    if (reviewFilter === 'CORRECT') return ans.correct;
    if (reviewFilter === 'INCORRECT') return !ans.correct && ans.selectedOption !== null;
    if (reviewFilter === 'SKIPPED') return ans.selectedOption === null;
    return true;
  });

  const minutesTaken = Math.floor(result.timeTakenSeconds / 60);
  const secondsTaken = result.timeTakenSeconds % 60;
  const timeFormatted = `${minutesTaken}m ${secondsTaken}s`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Result Hero Banner */}
      <div className={`p-8 sm:p-10 rounded-3xl border text-center relative overflow-hidden ${
        result.passed
          ? 'bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border-emerald-200/80 shadow-lg shadow-emerald-500/5'
          : 'bg-gradient-to-br from-rose-50 via-amber-50/30 to-white border-rose-200/80 shadow-lg shadow-rose-500/5'
      }`}>
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-sm">
          {result.passed ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Award className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
              <RotateCcw className="w-8 h-8" />
            </div>
          )}
        </div>

        <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
          result.passed 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-rose-100 text-rose-800'
        }`}>
          {result.passed ? 'Assessment Passed' : 'Needs Improvement'}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {result.passed ? 'Outstanding Performance!' : 'Keep Practicing!'}
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          You completed <span className="font-semibold text-slate-900">{result.quizTitle}</span> ({result.categoryName}).
          Your score has been computed automatically.
        </p>

        {/* Big Score Card */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex-1 w-full text-center">
            <div className="text-3xl sm:text-4xl font-black text-indigo-600">
              {result.totalScore} <span className="text-xl font-normal text-slate-400">/ {result.maxScore}</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Total Score Points</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex-1 w-full text-center">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              {result.percentage}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-1">
              Pass Target: {result.passingPercentage}%
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setSelectedQuizId(result.quizId);
              setActivePage('quiz-take');
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </button>
          <button
            onClick={() => setActivePage('leaderboard')}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            View Leaderboard
          </button>
          <button
            onClick={() => setActivePage('quizzes')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            All Quizzes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{result.correctCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Correct Answers</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{result.incorrectCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Incorrect Answers</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{result.skippedCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Skipped Questions</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-center">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{timeFormatted}</div>
          <div className="text-xs text-slate-500 mt-0.5">Time Taken</div>
        </div>

      </div>

      {/* Question-by-Question Solution Review */}
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Detailed Answer Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your answers, correct solutions, and rationales for continuous learning.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setReviewFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                reviewFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({result.answers?.length || 0})
            </button>
            <button
              onClick={() => setReviewFilter('CORRECT')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                reviewFilter === 'CORRECT' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              Correct ({result.correctCount})
            </button>
            <button
              onClick={() => setReviewFilter('INCORRECT')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                reviewFilter === 'INCORRECT' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-800'
              }`}
            >
              Incorrect ({result.incorrectCount})
            </button>
            <button
              onClick={() => setReviewFilter('SKIPPED')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                reviewFilter === 'SKIPPED' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Skipped ({result.skippedCount})
            </button>
          </div>
        </div>

        {/* Answer Cards */}
        <div className="space-y-4">
          {filteredAnswers.map((ans, idx) => {
            const isSkipped = ans.selectedOption === null;
            const options = [
              { letter: 'A', text: ans.optionA },
              { letter: 'B', text: ans.optionB },
              { letter: 'C', text: ans.optionC },
              { letter: 'D', text: ans.optionD },
            ];

            return (
              <div
                key={ans.questionId}
                className={`bg-white rounded-3xl border p-6 sm:p-7 shadow-xs space-y-4 ${
                  ans.correct
                    ? 'border-emerald-200/90'
                    : isSkipped
                    ? 'border-slate-200'
                    : 'border-rose-200/90'
                }`}
              >
                {/* Header question meta */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Question #{idx + 1}
                  </span>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    ans.correct
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isSkipped
                      ? 'bg-slate-100 text-slate-600 border border-slate-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {ans.correct ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Correct (+{ans.correct ? 1 : 0})
                      </>
                    ) : isSkipped ? (
                      <>
                        <HelpCircle className="w-3.5 h-3.5" /> Skipped
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {ans.questionText}
                </h3>

                {/* Options representation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {options.map((opt) => {
                    const isUserChoice = ans.selectedOption === opt.letter;
                    const isCorrectAnswer = ans.correctOption === opt.letter;

                    let optStyle = 'border-slate-200 bg-slate-50/50 text-slate-700';
                    let letterStyle = 'bg-slate-200 text-slate-700';

                    if (isCorrectAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                      letterStyle = 'bg-emerald-600 text-white';
                    } else if (isUserChoice && !ans.correct) {
                      optStyle = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                      letterStyle = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={opt.letter}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${letterStyle}`}>
                            {opt.letter}
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        {isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Correct
                          </span>
                        )}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {ans.explanation && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
                    <span className="font-bold text-indigo-900 block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Explanation & Rationale:
                    </span>
                    <p className="leading-relaxed text-indigo-900/90">{ans.explanation}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
