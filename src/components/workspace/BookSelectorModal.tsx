'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useBook } from '@/context/BookContext';
import { BookPlus, Check, Library, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { TextDirection } from '@/types/book';

interface BookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookSelectorModal({ isOpen, onClose }: BookSelectorModalProps) {
  const {
    allBooks,
    currentBook,
    switchBook,
    createNewBook,
    deleteCurrentBook,
    resetToSampleBook,
    t,
  } = useBook();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newLang, setNewLang] = useState('en');
  const [newDir, setNewDir] = useState<TextDirection>('ltr');

  const handleLangChange = (lang: string) => {
    setNewLang(lang);
    setNewDir(lang === 'ar' ? 'rtl' : 'ltr');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createNewBook(
      newTitle.trim(),
      newAuthor.trim() || 'Anonymous',
      newLang,
      newDir
    );
    setNewTitle('');
    setNewAuthor('');
    setIsCreating(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.bookLibrary}
      subtitle={t.bookProject}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {isCreating ? (
          <form
            onSubmit={handleCreate}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BookPlus className="w-4 h-4 text-sky-500" />
              {t.createNewBook}
            </h4>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.bookTitle} *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Chronicles of the Far Horizon"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {t.authorName}
              </label>
              <input
                type="text"
                placeholder="e.g. Elena Vance"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.language}
                </label>
                <select
                  value={newLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  <option value="en">English (LTR)</option>
                  <option value="ar">العربية (RTL)</option>
                  <option value="es">Español (LTR)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.textDirection}
                </label>
                <select
                  value={newDir}
                  onChange={(e) => setNewDir(e.target.value as TextDirection)}
                  className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  <option value="ltr">LTR (Left to Right)</option>
                  <option value="rtl">RTL (Right to Left)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                size="xs"
                variant="ghost"
                type="button"
                onClick={() => setIsCreating(false)}
              >
                {t.cancel}
              </Button>
              <Button size="xs" variant="primary" type="submit">
                {t.createNewBook}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.bookLibrary} ({allBooks.length})
            </span>
            <Button
              size="xs"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsCreating(true)}
            >
              {t.createNewBook}
            </Button>
          </div>
        )}

        {/* Book List */}
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {allBooks.map((bookMeta) => {
            const isSelected = bookMeta.id === currentBook.metadata.id;
            return (
              <div
                key={bookMeta.id}
                onClick={() => {
                  switchBook(bookMeta.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-500/50 text-slate-900 dark:text-slate-100'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-14 rounded shadow-sm flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0"
                    style={{
                      backgroundColor: bookMeta.coverConfig?.bgColor1 || '#0f172a',
                    }}
                  >
                    Cover
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-semibold truncate">{bookMeta.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {bookMeta.author} • {bookMeta.language?.toUpperCase() || 'EN'}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 shrink-0">
                    <Check className="w-4 h-4" />
                    {t.active}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 hover:text-sky-500 shrink-0">
                    {t.switchToThis}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              if (confirm('Reset to sample book? This will reload default sample chapters.')) {
                resetToSampleBook();
                onClose();
              }
            }}
          >
            {t.restoreSample}
          </Button>

          {allBooks.length > 1 && (
            <Button
              size="xs"
              variant="danger"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (confirm(`Delete "${currentBook.metadata.title}"?`)) {
                  deleteCurrentBook();
                  onClose();
                }
              }}
            >
              {t.deleteCurrentBook}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}