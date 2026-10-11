import React from 'react';

export default function DifficultyBadge({ difficulty }) {
  const diff = (difficulty || 'MEDIUM').toUpperCase();
  
  const styles = {
    EASY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HARD: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const currentStyle = styles[diff] || styles.MEDIUM;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {diff}
    </span>
  );
}
