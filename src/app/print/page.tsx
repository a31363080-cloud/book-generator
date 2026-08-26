'use client';

import React, { useEffect, useState } from 'react';
import { getBook, getStoredCurrentBookId } from '@/lib/storage';
import { Book } from '@/types/book';
import { SAMPLE_BOOK } from '@/lib/sampleData';
import { CoverCanvas } from '@/components/cover/CoverCanvas';
import { Printer, ArrowLeft, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function PrintPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [margins, setMargins] = useState<'normal' | 'narrow' | 'wide'>('normal');

  useEffect(() => {
    const id = getStoredCurrentBookId();
    if (id) {
      const b = getBook(id);
      if (b) {
        setBook(b);
        return;
      }
    }
    setBook(SAMPLE_BOOK);
  }, []);

  if (!book) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading manuscript for print...
      </div>
    );
  }

  const isRtl = book.metadata.direction === 'rtl' || book.metadata.language === 'ar';

  const marginClasses = {
    normal: 'max-w-3xl px-8 sm:px-16 py-12',
    narrow: 'max-w-4xl px-4 sm:px-8 py-8',
    wide: 'max-w-2xl px-12 sm:px-20 py-16',
  }[margins];

  return (
    <div
      className={`min-h-screen bg-white text-slate-900 antialiased print:bg-white print:text-black ${
        isRtl ? 'font-arabic' : 'font-serif'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Floating Web Print Controls */}
      <div className="print:hidden sticky top-0 z-50 bg-slate-900 text-white px-6 py-3 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isRtl ? 'العودة إلى المحرر' : 'Back to Editor'}
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-sm font-semibold truncate">
            {isRtl ? 'معاينة الطباعة: ' : 'Print Preview: '} {book.metadata.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Margins Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الهوامش:' : 'Margins:'}</span>
            <select
              value={margins}
              onChange={(e) => setMargins(e.target.value as any)}
              className="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none"
            >
              <option value="normal">{isRtl ? 'عادية (1 بوصة)' : 'Normal (1 in)'}</option>
              <option value="narrow">{isRtl ? 'ضيقة' : 'Narrow'}</option>
              <option value="wide">{isRtl ? 'عريضة' : 'Wide'}</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            {isRtl ? 'طباعة / حفظ بتنسيق PDF' : 'Print / Save as PDF'}
          </button>
        </div>
      </div>

      {/* Printable Manuscript Document Container */}
      <div className={`mx-auto ${marginClasses} print:max-w-none print:px-0 print:py-0`}>
        {/* Cover Page */}
        <section className="print:break-after-page min-h-[90vh] flex flex-col items-center justify-center text-center p-8 border-b print:border-none">
          <div className="w-80 shadow-xl rounded-lg overflow-hidden my-auto print:shadow-none">
            <CoverCanvas config={book.metadata.coverConfig} width={600} height={900} />
          </div>
        </section>

        {/* Title & Copyright Page */}
        <section className="print:break-after-page min-h-[90vh] flex flex-col justify-between py-16 border-b print:border-none text-center">
          <div className="my-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {book.metadata.title}
            </h1>
            {book.metadata.subtitle && (
              <p className="text-xl italic text-slate-600">
                {book.metadata.subtitle}
              </p>
            )}
            <div className="w-16 h-0.5 bg-slate-400 mx-auto my-6" />
            <p className="text-lg font-semibold tracking-wide">
              {isRtl ? 'تأليف ' : 'BY '} {book.metadata.author.toUpperCase()}
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1 font-sans">
            {book.metadata.publisher && (
              <p>{isRtl ? 'الناشر: ' : 'Published by '} {book.metadata.publisher}</p>
            )}
            {book.metadata.isbn && <p>ISBN: {book.metadata.isbn}</p>}
            <p>© {new Date().getFullYear()} {book.metadata.author}. All rights reserved.</p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="print:break-after-page py-12 border-b print:border-none">
          <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest font-sans text-slate-800">
            {isRtl ? 'جدول المحتويات' : 'Table of Contents'}
          </h2>
          <div className="space-y-3 max-w-lg mx-auto font-sans text-sm">
            {book.chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className="flex items-center justify-between border-b border-dotted border-slate-300 pb-1"
              >
                <span>
                  {idx + 1}. {ch.title}
                </span>
                <span className="text-slate-400 font-mono text-xs">
                  {ch.wordCount} {isRtl ? 'كلمة' : 'w'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Chapters Content */}
        {book.chapters.map((ch) => (
          <article
            key={ch.id}
            className="print:break-after-page py-12 border-b print:border-none prose prose-slate max-w-none text-justify leading-relaxed"
          >
            <div
              className="chapter-body"
              dangerouslySetInnerHTML={{ __html: ch.content }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}