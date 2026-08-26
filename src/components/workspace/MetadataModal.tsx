'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useBook } from '@/context/BookContext';
import { Button } from '../ui/Button';
import { Check } from 'lucide-react';
import { TextDirection } from '@/types/book';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetadataModal({ isOpen, onClose }: MetadataModalProps) {
  const { currentBook, updateMetadata, t } = useBook();
  const [form, setForm] = useState({
    title: currentBook.metadata.title,
    subtitle: currentBook.metadata.subtitle || '',
    author: currentBook.metadata.author,
    publisher: currentBook.metadata.publisher || '',
    language: currentBook.metadata.language || 'en',
    direction: currentBook.metadata.direction || (currentBook.metadata.language === 'ar' ? 'rtl' : 'ltr'),
    isbn: currentBook.metadata.isbn || '',
    publicationDate: currentBook.metadata.publicationDate || '',
    description: currentBook.metadata.description || '',
    genre: currentBook.metadata.genre || '',
    targetWordCount: currentBook.metadata.targetWordCount || 50000,
  });

  const handleLanguageChange = (lang: string) => {
    const isAr = lang === 'ar';
    setForm((prev) => ({
      ...prev,
      language: lang,
      direction: isAr ? 'rtl' : 'ltr',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMetadata({
      ...form,
      direction: form.direction as TextDirection,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.metadata}
      subtitle={t.synopsis}
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.bookTitle} *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.subtitle}
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.authorName} *
            </label>
            <input
              type="text"
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Publisher */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.publisher}
            </label>
            <input
              type="text"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.language}
            </label>
            <select
              value={form.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="en">English (en)</option>
              <option value="ar">العربية - Arabic (ar)</option>
              <option value="es">Español - Spanish (es)</option>
              <option value="fr">Français - French (fr)</option>
              <option value="de">Deutsch - German (de)</option>
              <option value="it">Italiano - Italian (it)</option>
              <option value="pt">Português - Portuguese (pt)</option>
              <option value="ja">日本語 - Japanese (ja)</option>
              <option value="zh">中文 - Chinese (zh)</option>
            </select>
          </div>

          {/* Text Direction (LTR / RTL) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.textDirection}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, direction: 'ltr' })}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  form.direction === 'ltr'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.ltrText}
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, direction: 'rtl' })}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  form.direction === 'rtl'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.rtlText}
              </button>
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.genre}
            </label>
            <input
              type="text"
              placeholder="e.g. Science Fiction / Cyberpunk"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Target Word Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              {t.targetWordCount}
            </label>
            <input
              type="number"
              step="1000"
              value={form.targetWordCount}
              onChange={(e) =>
                setForm({ ...form, targetWordCount: parseInt(e.target.value) || 20000 })
              }
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Description / Blurb */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {t.synopsis}
          </label>
          <textarea
            rows={3}
            placeholder="Write a captivating summary of your book..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button type="submit" variant="primary" leftIcon={<Check className="w-4 h-4" />}>
            {t.saveMetadata}
          </Button>
        </div>
      </form>
    </Modal>
  );
}