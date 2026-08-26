'use client';

import React, { useState } from 'react';
import { Chapter, ChapterStatus } from '@/types/book';
import { cn } from '@/lib/utils';
import {
  GripVertical,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { useBook } from '@/context/BookContext';

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onUpdateTitle: (title: string) => void;
  onUpdateStatus: (status: ChapterStatus) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

export function ChapterItem({
  chapter,
  index,
  isActive,
  onSelect,
  onUpdateTitle,
  onUpdateStatus,
  onDuplicate,
  onDelete,
  dragHandleProps,
}: ChapterItemProps) {
  const { t } = useBook();
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(chapter.title);

  const handleTitleSubmit = () => {
    setIsEditing(false);
    if (titleInput.trim() && titleInput !== chapter.title) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(chapter.title);
    }
  };

  const statusDropdownItems: (DropdownItem | 'divider')[] = [
    {
      id: 'status-draft',
      label: t.markAsDraft,
      icon: <Clock3 className="w-3.5 h-3.5 text-amber-500" />,
      onClick: () => onUpdateStatus('draft'),
    },
    {
      id: 'status-review',
      label: t.markInReview,
      icon: <AlertCircle className="w-3.5 h-3.5 text-sky-500" />,
      onClick: () => onUpdateStatus('review'),
    },
    {
      id: 'status-complete',
      label: t.markAsComplete,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      onClick: () => onUpdateStatus('complete'),
    },
    'divider',
    {
      id: 'action-rename',
      label: t.renameChapter,
      icon: <Edit2 className="w-3.5 h-3.5" />,
      onClick: () => setIsEditing(true),
    },
    {
      id: 'action-duplicate',
      label: t.duplicateChapter,
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: onDuplicate,
    },
    {
      id: 'action-delete',
      label: t.deleteChapter,
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
      danger: true,
      onClick: onDelete,
    },
  ];

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative flex items-center justify-between gap-2 px-2.5 py-2.5 rounded-2xl transition-all duration-150 cursor-pointer border select-none',
        isActive
          ? 'bg-white dark:bg-zinc-900 shadow-sm border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold ring-1 ring-sky-500/30'
          : 'bg-transparent border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors p-0.5"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Chapter Order Number */}
        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 w-4 text-center">
          {(index + 1).toString().padStart(2, '0')}
        </span>

        {/* Title / Inline Edit */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleInput(chapter.title);
                  setIsEditing(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-xs font-semibold px-2 py-0.5 bg-white dark:bg-zinc-950 border border-sky-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 text-zinc-900 dark:text-zinc-100"
            />
          ) : (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="truncate text-xs tracking-tight"
              title={chapter.title}
            >
              {chapter.title}
            </div>
          )}

          {/* Micro Stats */}
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
            <span>{chapter.wordCount.toLocaleString()} {t.words}</span>
            <span>•</span>
            <span className="capitalize">{chapter.status}</span>
          </div>
        </div>
      </div>

      {/* Actions & Status Tag */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          align="right"
          trigger={
            <div className="opacity-90 hover:opacity-100 transition-opacity">
              <StatusBadge status={chapter.status} />
            </div>
          }
          items={[
            {
              id: 'set-draft',
              label: t.draft,
              icon: <Clock3 className="w-3.5 h-3.5 text-amber-500" />,
              onClick: () => onUpdateStatus('draft'),
            },
            {
              id: 'set-review',
              label: t.review,
              icon: <AlertCircle className="w-3.5 h-3.5 text-sky-500" />,
              onClick: () => onUpdateStatus('review'),
            },
            {
              id: 'set-complete',
              label: t.complete,
              icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
              onClick: () => onUpdateStatus('complete'),
            },
          ]}
        />

        <Dropdown
          align="right"
          trigger={
            <button className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          }
          items={statusDropdownItems}
        />
      </div>
    </div>
  );
}