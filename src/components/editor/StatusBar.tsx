'use client';

import React from 'react';
import { useBook } from '@/context/BookContext';
import { Chapter } from '@/types/book';
import { StatusBadge } from '../ui/Badge';
import { Clock3, FileText, Maximize2, Type } from 'lucide-react';

interface StatusBarProps {
  activeChapter?: Chapter;
}

export function StatusBar({ activeChapter }: StatusBarProps) {
  const { currentBook, totalStats, font, toggleFocusMode, t } = useBook();

  const chapterWords = activeChapter?.wordCount || 0;
  const chapterChars = activeChapter?.characterCount || 0;
  const readingTime = Math.max(1, Math.ceil(chapterWords / 200));

  const totalBookWords = totalStats.words;
  const percentOfBook =
    totalBookWords > 0 ? Math.round((chapterWords / totalBookWords) * 100) : 0;

  return (
    <div className="h-8 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 select-none z-10 shrink-0">
      {/* Left: Chapter status & word count */}
      <div className="flex items-center gap-3">
        {activeChapter && <StatusBadge status={activeChapter.status} />}
        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
          <FileText className="w-3 h-3 text-sky-500" />
          {chapterWords.toLocaleString()} {t.words} ({chapterChars.toLocaleString()} {t.chars})
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:flex items-center gap-1 text-slate-500">
          <Clock3 className="w-3 h-3 text-amber-500" />
          ~{readingTime} {t.minRead}
        </span>
      </div>

      {/* Right: Book context & font info */}
      <div className="flex items-center gap-3">
        <span className="hidden md:inline text-slate-400">
          {percentOfBook}% ({totalBookWords.toLocaleString()} {t.words})
        </span>
        <span className="hidden sm:inline capitalize font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
          {font}
        </span>
        <button
          onClick={() => toggleFocusMode(true)}
          className="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          title={t.zenMode}
        >
          <Maximize2 className="w-3 h-3" />
          <span className="hidden sm:inline">{t.zenMode}</span>
        </button>
      </div>
    </div>
  );
}