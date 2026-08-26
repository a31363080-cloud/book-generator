'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { useBook } from '@/context/BookContext';
import {
  Clock3,
  FileText,
  Layers,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface BookStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookStatsModal({ isOpen, onClose }: BookStatsModalProps) {
  const { currentBook, totalStats, updateMetadata, t } = useBook();

  const targetWords = currentBook.metadata.targetWordCount || 50000;
  const progressPercent = Math.min(100, Math.round((totalStats.words / targetWords) * 100));

  const draftChapters = currentBook.chapters.filter((c) => c.status === 'draft');
  const reviewChapters = currentBook.chapters.filter((c) => c.status === 'review');
  const completeChapters = currentBook.chapters.filter((c) => c.status === 'complete');

  const avgWordsPerChapter =
    currentBook.chapters.length > 0
      ? Math.round(totalStats.words / currentBook.chapters.length)
      : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.bookAnalytics}
      subtitle={`"${currentBook.metadata.title}"`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Progress Goal Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/30">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.writingProgress}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalStats.words.toLocaleString()} / {targetWords.toLocaleString()} {t.words}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {progressPercent}%
              </span>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t.completed}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/40">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-600 dark:text-slate-300">
            <span>
              {t.goal}: {targetWords.toLocaleString()} {t.words}
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">{t.targetWordCount}:</label>
              <input
                type="number"
                step="1000"
                value={targetWords}
                onChange={(e) =>
                  updateMetadata({ targetWordCount: parseInt(e.target.value) || 10000 })
                }
                className="w-24 px-2 py-0.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <FileText className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.totalWords}</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {totalStats.words.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.chaptersCount}</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {currentBook.chapters.length}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock3 className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.readingTime}</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              ~{totalStats.readingTime} {t.minRead}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.avgPerChapter}</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {avgWordsPerChapter.toLocaleString()} {t.words}
            </p>
          </div>
        </div>

        {/* Chapter Breakdown by Status */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.workflowBreakdown}
          </h5>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {draftChapters.length}
              </span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.draft}</p>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
              <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
                {reviewChapters.length}
              </span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.review}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {completeChapters.length}
              </span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{t.complete}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            {t.close}
          </Button>
        </div>
      </div>
    </Modal>
  );
}