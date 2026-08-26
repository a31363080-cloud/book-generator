'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useBook } from '@/context/BookContext';
import {
  Sparkles,
  BookOpen,
  ListOrdered,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Layers,
  FileText,
  Languages,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  runAIAction,
  parseChapterTitlesJson,
  textToHtml,
  ALL_MODELS,
  DEFAULT_MODEL_ID,
  PROVIDER_GROUPS,
  ModelConfig,
  Provider,
} from '@/lib/ai-engine';
import { TextDirection } from '@/types/book';
import { cn } from '@/lib/utils';

interface AIBookWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 'setup' | 'outline' | 'generating' | 'completed';

interface ChapterGenStatus {
  title: string;
  status: 'pending' | 'generating' | 'done' | 'error';
  content?: string;
  wordCount?: number;
  error?: string;
}

export function AIBookWizardModal({ isOpen, onClose }: AIBookWizardModalProps) {
  const { createBookWithChapters, setUiLanguage, t } = useBook();

  // Wizard state
  const [step, setStep] = useState<WizardStep>('setup');
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);

  // Form parameters (User Inputs)
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fiction / Novel');
  const [language, setLanguage] = useState('en');
  const [numChapters, setNumChapters] = useState(5);

  // Step 1: Outline state
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [outlineError, setOutlineError] = useState<string | null>(null);
  const [proposedChapters, setProposedChapters] = useState<string[]>([]);

  // Step 2: Chapter generation progress state
  const [chaptersProgress, setChaptersProgress] = useState<ChapterGenStatus[]>([]);
  const [currentGenIndex, setCurrentGenIndex] = useState(0);
  const [isAborted, setIsAborted] = useState(false);
  const abortRef = useRef(false);

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  // ─── Step 1: Generate Outline ──────────────────────────────────────────────
  const handleGenerateOutline = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsGeneratingOutline(true);
    setOutlineError(null);

    try {
      const response = await runAIAction({
        action: 'generate_book_outline',
        modelId: selectedModelId,
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: author.trim() || 'Anonymous Author',
        description: description.trim(),
        category: category.trim(),
        language,
        numChapters,
      });

      const parsedTitles = parseChapterTitlesJson(
        response.result,
        numChapters,
        language === 'ar' ? 'الفصل' : language === 'es' ? 'Capítulo' : 'Chapter'
      );

      setProposedChapters(parsedTitles);
      setStep('outline');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate outline.';
      setOutlineError(msg);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Chapter list manipulation
  const handleUpdateChapterTitle = (index: number, newTitle: string) => {
    setProposedChapters((prev) => {
      const updated = [...prev];
      updated[index] = newTitle;
      return updated;
    });
  };

  const handleAddChapter = () => {
    const nextNum = proposedChapters.length + 1;
    const prefix = language === 'ar' ? `الفصل ${nextNum}: فصل جديد` : language === 'es' ? `Capítulo ${nextNum}: Nuevo Capítulo` : `Chapter ${nextNum}: New Section`;
    setProposedChapters((prev) => [...prev, prefix]);
  };

  const handleRemoveChapter = (index: number) => {
    if (proposedChapters.length <= 1) return;
    setProposedChapters((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── Step 2: Generate Chapter-by-Chapter ──────────────────────────────────
  const handleStartGeneration = async () => {
    if (proposedChapters.length === 0) return;

    abortRef.current = false;
    setIsAborted(false);
    setStep('generating');

    const initialStatus: ChapterGenStatus[] = proposedChapters.map((ch) => ({
      title: ch,
      status: 'pending',
    }));
    setChaptersProgress(initialStatus);

    const generatedChaptersData: Array<{ title: string; content: string }> = [];

    for (let i = 0; i < proposedChapters.length; i++) {
      if (abortRef.current) break;

      setCurrentGenIndex(i);
      setChaptersProgress((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'generating' };
        return next;
      });

      try {
        const chapterTitle = proposedChapters[i];
        const res = await runAIAction({
          action: 'generate_chapter_content',
          modelId: selectedModelId,
          title: title.trim(),
          subtitle: subtitle.trim(),
          author: author.trim() || 'Anonymous Author',
          description: description.trim(),
          category: category.trim(),
          language,
          chapterTitle,
          chapterIndex: i + 1,
          totalChapters: proposedChapters.length,
          allChapterTitles: proposedChapters,
        });

        const htmlContent = textToHtml(res.result);
        const wordCount = htmlContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;

        generatedChaptersData.push({
          title: chapterTitle,
          content: htmlContent,
        });

        setChaptersProgress((prev) => {
          const next = [...prev];
          next[i] = {
            ...next[i],
            status: 'done',
            content: htmlContent,
            wordCount,
          };
          return next;
        });
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Chapter generation failed';
        setChaptersProgress((prev) => {
          const next = [...prev];
          next[i] = {
            ...next[i],
            status: 'error',
            error: errMsg,
          };
          return next;
        });
        // Allow user to see error or continue
      }
    }

    if (!abortRef.current && generatedChaptersData.length > 0) {
      // Import the full book into BookContext
      const dir: TextDirection = language === 'ar' ? 'rtl' : 'ltr';
      createBookWithChapters(
        {
          title: title.trim(),
          subtitle: subtitle.trim(),
          author: author.trim() || 'Anonymous Author',
          description: description.trim(),
          genre: category.trim(),
          language,
          direction: dir,
        },
        generatedChaptersData
      );

      if (language === 'ar') {
        setUiLanguage('ar');
      }

      setStep('completed');
    }
  };

  const handleFinish = () => {
    onClose();
  };

  const currentModel = ALL_MODELS[selectedModelId] || ALL_MODELS[DEFAULT_MODEL_ID];
  const isRtl = language === 'ar';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Book Studio Generator"
      subtitle="Two-Step AI Manuscript Creation: Outline Review & Chapter-by-Chapter Generation"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Step Progress Header */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold">
          <div
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all',
              step === 'setup'
                ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-zinc-500 opacity-60'
            )}
          >
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-black">
              1
            </span>
            <span className="truncate">1. Book Premise</span>
          </div>

          <div
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all',
              step === 'outline'
                ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-zinc-500 opacity-60'
            )}
          >
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-black">
              2
            </span>
            <span className="truncate">2. Chapter Outline</span>
          </div>

          <div
            className={cn(
              'flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all',
              step === 'generating' || step === 'completed'
                ? 'bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm font-bold'
                : 'text-zinc-500 opacity-60'
            )}
          >
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-[10px] font-black">
              3
            </span>
            <span className="truncate">3. Full Generation</span>
          </div>
        </div>

        {/* ─── STEP 1: SETUP FORM ────────────────────────────────────────── */}
        {step === 'setup' && (
          <form onSubmit={handleGenerateOutline} className="space-y-4">
            {outlineError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{outlineError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Book Title ($title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronicles of the Solar Empire"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Subtitle ($subtitle)
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Awakening of the Orbital Colonies"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Author ($author)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Marcus Vance"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Category / Genre */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Category / Genre ($category) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hard Science Fiction, Mystery, Self-Help..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Language ($language)
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100"
                >
                  <option value="en">English (LTR)</option>
                  <option value="ar">العربية (Arabic - RTL)</option>
                  <option value="es">Español (Spanish - LTR)</option>
                </select>
              </div>

              {/* Chapters Count */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Number of Chapters: <span className="text-sky-500 font-extrabold">{numChapters}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={numChapters}
                  onChange={(e) => setNumChapters(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500 mt-2"
                />
              </div>
            </div>

            {/* Description / Premise */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Book Premise & Storyline Description ($description) *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Provide a detailed storyline, core themes, key characters, and the central conflict. Gemini will strictly adhere to this exact premise."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
              />
            </div>

            {/* AI Model Selector */}
            <div className="p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  AI Model:
                </span>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {currentModel.label}
                </span>
              </div>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                {PROVIDER_GROUPS.flatMap((g) =>
                  g.models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {g.label}: {m.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={isGeneratingOutline}
                leftIcon={
                  isGeneratingOutline ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )
                }
              >
                {isGeneratingOutline ? 'Generating Outline…' : 'Generate Outline (Step 1)'}
              </Button>
            </div>
          </form>
        )}

        {/* ─── STEP 2: OUTLINE APPROVAL & EDITING ──────────────────────────── */}
        {step === 'outline' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300 text-xs leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Step 1 Complete: Proposed Chapter Outline Generated!</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Review, edit, add, or reorder chapter titles below before generating the full prose.
                </p>
              </div>
            </div>

            {/* Editable Chapter Titles */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {proposedChapters.map((chTitle, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800"
                >
                  <span className="w-6 h-6 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600 dark:text-zinc-400 shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={chTitle}
                    onChange={(e) => handleUpdateChapterTitle(idx, e.target.value)}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {proposedChapters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(idx)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove chapter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                size="xs"
                variant="outline"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleAddChapter}
              >
                Add Chapter
              </Button>

              <Button
                size="xs"
                variant="ghost"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => handleGenerateOutline()}
              >
                Regenerate Outline
              </Button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setStep('setup')}
              >
                Back to Setup
              </Button>

              <Button
                size="sm"
                variant="primary"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={handleStartGeneration}
              >
                ✨ Generate Complete Book ({proposedChapters.length} Chapters)
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: SEQUENTIAL CHAPTER GENERATION ──────────────────────── */}
        {(step === 'generating' || step === 'completed') && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                <span>
                  {step === 'completed'
                    ? '🎉 All Chapters Successfully Generated!'
                    : `Writing Chapter ${currentGenIndex + 1} of ${chaptersProgress.length}…`}
                </span>
                <span className="text-sky-600 dark:text-sky-400">
                  {Math.round(
                    (chaptersProgress.filter((c) => c.status === 'done').length /
                      chaptersProgress.length) *
                      100
                  )}
                  %
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
                  style={{
                    width: `${
                      (chaptersProgress.filter((c) => c.status === 'done').length /
                        chaptersProgress.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Chapter Progress Cards */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {chaptersProgress.map((ch, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border text-xs transition-all',
                    ch.status === 'generating'
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-500/50 shadow-sm'
                      : ch.status === 'done'
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/30 text-zinc-800 dark:text-zinc-200'
                      : ch.status === 'error'
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-500/30 text-rose-700'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 opacity-60'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {ch.status === 'generating' && (
                      <Loader2 className="w-4 h-4 text-sky-500 animate-spin shrink-0" />
                    )}
                    {ch.status === 'done' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {ch.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    {ch.status === 'pending' && (
                      <span className="w-4 h-4 rounded-full border border-zinc-400 flex items-center justify-center text-[9px] shrink-0">
                        {i + 1}
                      </span>
                    )}

                    <span className="font-semibold truncate">{ch.title}</span>
                  </div>

                  <div className="shrink-0 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {ch.status === 'generating' && 'Writing prose…'}
                    {ch.status === 'done' && `${ch.wordCount || 0} words`}
                    {ch.status === 'error' && 'Failed'}
                    {ch.status === 'pending' && 'Queued'}
                  </div>
                </div>
              ))}
            </div>

            {/* Completion Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              {step === 'completed' ? (
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<BookOpen className="w-4 h-4" />}
                  onClick={handleFinish}
                >
                  Open Manuscript in Editor
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    abortRef.current = true;
                    setIsAborted(true);
                    setStep('outline');
                  }}
                >
                  Cancel Generation
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
