'use client';

import React from 'react';
import { useBook } from '@/context/BookContext';
import { ChapterList } from './ChapterList';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  PanelLeftClose,
  Sparkles,
  Settings,
  Target,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface SidebarProps {
  onOpenMetadata: () => void;
  onOpenCoverStudio: () => void;
  onOpenStats: () => void;
}

export function Sidebar({ onOpenMetadata, onOpenCoverStudio, onOpenStats }: SidebarProps) {
  const { currentBook, isSidebarOpen, toggleSidebar, totalStats, t, isRtlLayout } = useBook();

  if (!isSidebarOpen) return null;

  const targetWords = currentBook.metadata.targetWordCount || 50000;
  const progressPercent = Math.min(100, Math.round((totalStats.words / targetWords) * 100));

  const draftCount = currentBook.chapters.filter((c) => c.status === 'draft').length;
  const reviewCount = currentBook.chapters.filter((c) => c.status === 'review').length;
  const completeCount = currentBook.chapters.filter((c) => c.status === 'complete').length;

  return (
    <aside
      className={cn(
        'w-64 sm:w-[260px] h-full flex flex-col bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-xl shrink-0 select-none border-zinc-200/80 dark:border-zinc-800/80 shadow-sm',
        isRtlLayout ? 'border-l' : 'border-r'
      )}
    >
      {/* Book Header Card */}
      <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60">
        <div className="flex items-start justify-between gap-1.5">
          <div
            onClick={onOpenMetadata}
            className="flex-1 min-w-0 cursor-pointer group p-1 -m-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all"
          >
            <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-sky-500 transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t.bookProject}
              </span>
            </div>
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mt-0.5">
              {currentBook.metadata.title}
            </h2>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
              {currentBook.metadata.author || 'Anonymous'}
            </p>
          </div>

          <button
            onClick={toggleSidebar}
            title={t.close}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <PanelLeftClose className={cn('w-3.5 h-3.5', isRtlLayout && 'scale-x-[-1]')} />
          </button>
        </div>

        {/* Word Count Goal Tracker Card */}
        <div
          onClick={onOpenStats}
          className="mt-2.5 p-2 bg-zinc-100/90 dark:bg-zinc-900/80 rounded-xl border border-zinc-200/60 dark:border-zinc-800 cursor-pointer hover:border-sky-500/40 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-semibold">
              <Target className="w-3 h-3 text-sky-500" />
              <span className="text-[10px]">
                {t.goal}: {targetWords.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-black text-sky-600 dark:text-sky-400">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Micro Stats */}
          <div className="flex items-center justify-between mt-1.5 text-[9px] text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {totalStats.words.toLocaleString()} {t.words}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 font-medium" title={t.draft}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {draftCount}
              </span>
              <span className="flex items-center gap-0.5 font-medium" title={t.review}>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {reviewCount}
              </span>
              <span className="flex items-center gap-0.5 font-medium" title={t.complete}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {completeCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Drag & Drop List */}
      <div className="flex-1 overflow-hidden">
        <ChapterList />
      </div>

      {/* Sidebar Quick Footer Actions */}
      <div className="p-2 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 flex items-center justify-between gap-1.5">
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Sparkles className="w-3 h-3 text-sky-500" />}
          onClick={onOpenCoverStudio}
          className="flex-1 text-[11px] rounded-lg py-1"
        >
          {t.coverStudio}
        </Button>
        <Button
          size="xs"
          variant="outline"
          leftIcon={<Settings className="w-3 h-3 text-zinc-500" />}
          onClick={onOpenMetadata}
          className="flex-1 text-[11px] rounded-lg py-1"
        >
          {t.metadata}
        </Button>
      </div>
    </aside>
  );
}