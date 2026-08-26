'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { useBook } from '@/context/BookContext';
import { ExportFormat } from '@/types/book';
import { exportAsEpub } from '@/lib/epubGenerator';
import { exportAsDocx } from '@/lib/docxExporter';
import { exportAsMarkdown, exportAsPlainText } from '@/lib/markdownExporter';
import { exportBackupData } from '@/lib/storage';
import { Button } from '../ui/Button';
import { CoverCanvas } from '../cover/CoverCanvas';
import confetti from 'canvas-confetti';
import {
  Download,
  Book,
  FileText,
  Printer,
  FileCode,
  Archive,
  CheckCircle2,
  CheckSquare,
  Square,
  ExternalLink,
  FileSpreadsheet,
} from 'lucide-react';
import { saveAs } from 'file-saver';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { currentBook, totalStats, t } = useBook();

  const [format, setFormat] = useState<ExportFormat>('epub');
  const [includeCover, setIncludeCover] = useState(true);
  const [includeToc, setIncludeToc] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState<string[]>(
    currentBook.chapters.map((c) => c.id)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const toggleChapter = (id: string) => {
    if (selectedChapters.includes(id)) {
      if (selectedChapters.length <= 1) {
        alert('You must select at least one chapter to export.');
        return;
      }
      setSelectedChapters(selectedChapters.filter((cId) => cId !== id));
    } else {
      setSelectedChapters([...selectedChapters, id]);
    }
  };

  const selectAllChapters = () => {
    setSelectedChapters(currentBook.chapters.map((c) => c.id));
  };

  const deselectAllChapters = () => {
    if (currentBook.chapters.length > 0) {
      setSelectedChapters([currentBook.chapters[0].id]);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      if (format === 'epub') {
        let coverDataUrl: string | undefined = undefined;
        if (includeCover && hiddenCanvasRef.current) {
          coverDataUrl = hiddenCanvasRef.current.toDataURL('image/png');
        }
        await exportAsEpub(currentBook, coverDataUrl, selectedChapters);
      } else if (format === 'docx') {
        await exportAsDocx(currentBook, selectedChapters);
      } else if (format === 'markdown') {
        exportAsMarkdown(currentBook, selectedChapters);
      } else if (format === 'html') {
        exportAsPlainText(currentBook, selectedChapters);
      } else if (format === 'json') {
        const json = exportBackupData();
        const blob = new Blob([json], { type: 'application/json' });
        saveAs(
          blob,
          `${(currentBook.metadata.title || 'backup')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')}_backup.json`
        );
      } else if (format === 'pdf') {
        window.open('/print', '_blank');
      }

      setIsExporting(false);
      setExportSuccess(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please check console for details.');
      setIsExporting(false);
    }
  };

  const formats: {
    id: ExportFormat;
    name: string;
    ext: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'epub',
      name: 'EPUB 3.0',
      ext: '.epub',
      description: t.epubDocDesc,
      icon: <Book className="w-5 h-5 text-sky-500" />,
      badge: 'RECOMMENDED',
    },
    {
      id: 'docx',
      name: t.wordDocument,
      ext: '.docx',
      description: t.wordDocDesc,
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-500" />,
      badge: 'OFFICIAL',
    },
    {
      id: 'pdf',
      name: 'PDF / Printable Manuscript',
      ext: '.pdf',
      description: t.pdfDocDesc,
      icon: <Printer className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'markdown',
      name: 'Markdown',
      ext: '.md',
      description: t.mdDocDesc,
      icon: <FileCode className="w-5 h-5 text-indigo-500" />,
    },
    {
      id: 'html',
      name: 'Plain Text',
      ext: '.txt',
      description: t.txtDocDesc,
      icon: <FileText className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'json',
      name: 'JSON Archive',
      ext: '.json',
      description: t.jsonDocDesc,
      icon: <Archive className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.exportManuscript}
      subtitle={`"${currentBook.metadata.title}"`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Hidden Canvas for EPUB Cover Generation */}
        <div className="hidden">
          <CoverCanvas
            config={currentBook.metadata.coverConfig}
            width={800}
            height={1200}
            onCanvasReady={(c) => (hiddenCanvasRef.current = c)}
          />
        </div>

        {/* Format Selector Grid */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.selectOutputFormat}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {formats.map((fmt) => (
              <div
                key={fmt.id}
                onClick={() => setFormat(fmt.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  format === fmt.id
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                  {fmt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {fmt.name}
                    </span>
                    {fmt.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        {fmt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {fmt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Settings & Options */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.coverTitle}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCover}
                onChange={(e) => setIncludeCover(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>{t.includeCoverPage}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeToc}
                onChange={(e) => setIncludeToc(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>{t.includeToc}</span>
            </label>
          </div>
        </div>

        {/* Chapter Selection Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.selectChapters} ({selectedChapters.length} / {currentBook.chapters.length})
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={selectAllChapters}
                className="text-sky-600 dark:text-sky-400 hover:underline"
              >
                {t.selectAll}
              </button>
              <span>•</span>
              <button
                onClick={deselectAllChapters}
                className="text-slate-500 hover:underline"
              >
                {t.clearSelection}
              </button>
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {currentBook.chapters.map((ch, idx) => {
              const isChecked = selectedChapters.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  onClick={() => toggleChapter(ch.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    isChecked
                      ? 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-medium'
                      : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-sky-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className="font-mono text-[10px] text-slate-400 w-4">
                      {idx + 1}
                    </span>
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ms-2">
                    {ch.wordCount.toLocaleString()} {t.words}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Button & Feedback */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {exportSuccess && (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                {t.exportedSuccess}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button
              variant="primary"
              isLoading={isExporting}
              leftIcon={
                format === 'pdf' ? (
                  <ExternalLink className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )
              }
              onClick={handleExport}
            >
              {format === 'pdf'
                ? t.openPrintable
                : `Download ${formats.find((f) => f.id === format)?.name}`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}