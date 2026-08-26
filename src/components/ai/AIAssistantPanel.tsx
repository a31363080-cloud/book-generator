'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  Sparkles, X, Loader2, ClipboardPaste, RotateCcw, Copy,
  CheckCheck, AlertCircle, ChevronDown, PlusCircle, Cpu,
  Wand2, FileText, SpellCheck, ListOrdered, Expand, Languages,
  Briefcase, Smile, Info, ArrowDownToLine, Zap, Globe2, ShieldAlert
} from 'lucide-react';
import {
  runAIAction, textToHtml, AIAction, AIRequest,
  PROVIDER_GROUPS, ALL_MODELS, DEFAULT_MODEL_ID, ModelConfig, Provider
} from '@/lib/ai-engine';
import { useBook } from '@/context/BookContext';
import { cn } from '@/lib/utils';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface AIAssistantPanelProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  initialModelId?: string;
  onModelChange?: (modelId: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface ActionDef {
  id: AIAction;
  label: { en: string; ar: string; es: string };
  desc:  { en: string; ar: string; es: string };
  icon: React.ReactNode;
  accent: string;
  bg: string;
  primary: boolean;
}

// ─── Quick Actions Catalogue ──────────────────────────────────────────────────

const ACTIONS: ActionDef[] = [
  {
    id: 'continue_writing',
    label: { en: 'Continue Writing', ar: 'متابعة الكتابة', es: 'Continuar Escritura' },
    desc:  { en: 'Write the next 2-4 paragraphs in natural author voice', ar: 'كتابة الفقرات التالية بأسلوب الكاتب الطبيعي', es: 'Escribir los siguientes párrafos con estilo natural' },
    icon: <Wand2 className="w-4 h-4" />,
    accent: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50/90 dark:bg-violet-950/40 border-violet-200/60 dark:border-violet-800/40 hover:border-violet-400',
    primary: true,
  },
  {
    id: 'expand_chapter',
    label: { en: 'Expand Chapter', ar: 'توسيع الفصل', es: 'Expandir Capítulo' },
    desc:  { en: 'Enrich passage with sensory detail & emotional depth', ar: 'إثراء المقطع بالتفاصيل الحسية والعمق الدرامي', es: 'Enriquecer el pasaje con detalles y profundidad' },
    icon: <Expand className="w-4 h-4" />,
    accent: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50/90 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/40 hover:border-sky-400',
    primary: true,
  },
  {
    id: 'fix_grammar',
    label: { en: 'Fix Grammar & Style', ar: 'تصحيح القواعد والأسلوب', es: 'Corregir Gramática y Estilo' },
    desc:  { en: 'Proofread spelling, punctuation, syntax & flow', ar: 'تدقيق الإملاء وعلامات الترقيم والأسلوب', es: 'Corregir ortografía, puntuación y fluidez' },
    icon: <SpellCheck className="w-4 h-4" />,
    accent: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/40 hover:border-amber-400',
    primary: true,
  },
  {
    id: 'summarize',
    label: { en: 'Summarize Text', ar: 'تلخيص النص', es: 'Resumir Texto' },
    desc:  { en: 'Condense into a concise 3-5 sentence brief', ar: 'تلخيص المقطع في 3-5 جمل مركزة', es: 'Condensar en un resumen breve de 3-5 frases' },
    icon: <FileText className="w-4 h-4" />,
    accent: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-400',
    primary: true,
  },
  {
    id: 'generate_outline',
    label: { en: 'Generate Outline', ar: 'توليد مخطط الفصل', es: 'Generar Esquema' },
    desc:  { en: 'Structure beats, headings & narrative transitions', ar: 'هيكلة الفصول والأقسام والانتقالات الدرامية', es: 'Estructurar secciones y transiciones narrativas' },
    icon: <ListOrdered className="w-4 h-4" />,
    accent: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/40 hover:border-rose-400',
    primary: false,
  },
  {
    id: 'translate_ar',
    label: { en: 'Translate to Arabic (العربية)', ar: 'ترجمة إلى العربية الفصحى', es: 'Traducir al Árabe' },
    desc:  { en: 'Literary Modern Standard Arabic with full RTL flow', ar: 'ترجمة أدبية فصيحة باتجاه يمين-إلى-يسار سليم', es: 'Traducción literaria al árabe con flujo RTL' },
    icon: <span className="text-sm font-bold">🇸🇦</span>,
    accent: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-400',
    primary: false,
  },
  {
    id: 'translate_en',
    label: { en: 'Translate to English', ar: 'ترجمة إلى الإنجليزية', es: 'Traducir al Inglés' },
    desc:  { en: 'Fluent publication-ready English prose', ar: 'ترجمة إنجليزية أدبية احترافية جاهزة للنشر', es: 'Prosa inglesa fluida lista para publicación' },
    icon: <span className="text-sm font-bold">🇬🇧</span>,
    accent: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/40 hover:border-blue-400',
    primary: false,
  },
  {
    id: 'translate_es',
    label: { en: 'Translate to Spanish (Español)', ar: 'ترجمة إلى الإسبانية', es: 'Traducir al Español' },
    desc:  { en: 'Rich, natural literary Spanish translation', ar: 'ترجمة أدبية إسبانية طبيعية وغنية', es: 'Traducción literaria rica y natural al español' },
    icon: <span className="text-sm font-bold">🇪🇸</span>,
    accent: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50/90 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-800/40 hover:border-orange-400',
    primary: false,
  },
  {
    id: 'make_formal',
    label: { en: 'Make Formal & Academic', ar: 'صياغة بأسلوب أكاديمي رسمي', es: 'Hacer Formal y Académico' },
    desc:  { en: 'Sophisticated, authoritative prose tone', ar: 'أسلوب رصين وموثوق ومتقن', es: 'Tono formal, sofisticado y autoritario' },
    icon: <Briefcase className="w-4 h-4" />,
    accent: 'text-zinc-600 dark:text-zinc-300',
    bg: 'bg-zinc-50/90 dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-700/50 hover:border-zinc-400',
    primary: false,
  },
  {
    id: 'make_casual',
    label: { en: 'Make Casual & Conversational', ar: 'صياغة بأسلوب ودي جذاب', es: 'Hacer Casual y Conversacional' },
    desc:  { en: 'Warm, approachable, engaging flow', ar: 'تدفق دافئ وجذاب وقريب للقارئ', es: 'Flujo cálido, accesible y amigable' },
    icon: <Smile className="w-4 h-4" />,
    accent: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50/90 dark:bg-pink-950/40 border-pink-200/60 dark:border-pink-800/40 hover:border-pink-400',
    primary: false,
  },
];

const PRIMARY_ACTIONS = ACTIONS.filter((a) => a.primary);
const SECONDARY_ACTIONS = ACTIONS.filter((a) => !a.primary);

// ─── Provider Badges & Styling ────────────────────────────────────────────────

const PROVIDER_STYLES: Record<Provider, { badge: string; color: string; dot: string }> = {
  google:    { badge: 'Google Gemini', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200/60 dark:border-blue-800/50', dot: 'bg-blue-500' },
  openai:    { badge: 'OpenAI',        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/60 dark:border-emerald-800/50', dot: 'bg-emerald-500' },
  anthropic: { badge: 'Anthropic',     color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200/60 dark:border-amber-800/50', dot: 'bg-amber-500' },
  deepseek:  { badge: 'DeepSeek',      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200/60 dark:border-purple-800/50', dot: 'bg-purple-500' },
};

// ─── Model Selector Dropdown ─────────────────────────────────────────────────

export function ModelSelector({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const current = ALL_MODELS[selectedId] || ALL_MODELS[DEFAULT_MODEL_ID];
  const style = PROVIDER_STYLES[current.provider];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-semibold text-zinc-900 dark:text-zinc-100 transition-all shadow-sm"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn('w-2 h-2 rounded-full shrink-0', style.dot)} />
          <span className={cn('px-1.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider shrink-0', style.color)}>
            {current.provider}
          </span>
          <span className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">{current.label}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {current.badge && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-300/40 dark:border-zinc-700/50">
              {current.badge}
            </span>
          )}
          <ChevronDown className={cn('w-3.5 h-3.5 text-zinc-400 transition-transform duration-150', isOpen && 'rotate-180')} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full start-0 end-0 mt-1.5 z-50 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-950/20 max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800 animate-in fade-in zoom-in-95 duration-100">
          {PROVIDER_GROUPS.map((group) => {
            const groupStyle = PROVIDER_STYLES[group.provider];
            return (
              <div key={group.provider} className="p-1.5">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  <span className={cn('w-1.5 h-1.5 rounded-full', groupStyle.dot)} />
                  <span>{group.label}</span>
                </div>
                <div className="space-y-0.5 mt-0.5">
                  {group.models.map((model: ModelConfig) => {
                    const isSelected = model.id === selectedId;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          onChange(model.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all text-start',
                          isSelected
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                        )}
                      >
                        <span className="truncate">{model.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ms-2">
                          {model.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                              {model.badge}
                            </span>
                          )}
                          {isSelected && <span className="text-sky-500 font-bold text-xs">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main AI Assistant Panel Component ───────────────────────────────────────

export function AIAssistantPanel({
  editor,
  isOpen,
  onClose,
  initialModelId = DEFAULT_MODEL_ID,
  onModelChange,
}: AIAssistantPanelProps) {
  const { currentBook, activeChapter, uiLanguage, isRtlLayout } = useBook();
  const lang = (uiLanguage ?? 'en') as 'en' | 'ar' | 'es';

  const [selectedModelId, setSelectedModelId] = useState(initialModelId);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState('');
  const [activeAction, setActiveAction] = useState<ActionDef | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMoreTools, setShowMoreTools] = useState(false);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Sync model state change
  const handleModelSelect = (id: string) => {
    setSelectedModelId(id);
    if (onModelChange) onModelChange(id);
  };

  const L = (obj: { en: string; ar: string; es: string }) => obj[lang] ?? obj.en;

  // Show auto-fading toast notifications
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  // Retrieve current selection or entire chapter
  const getContextText = useCallback((): { text: string; isSelection: boolean } => {
    if (!editor) return { text: '', isSelection: false };
    const { from, to, empty } = editor.state.selection;
    if (!empty) {
      const selectedText = editor.state.doc.textBetween(from, to, '\n');
      return { text: selectedText, isSelection: true };
    }
    return { text: editor.getHTML(), isSelection: false };
  }, [editor]);

  // Execute AI action against /api/generate
  const executeAction = useCallback(async (action: ActionDef) => {
    if (!editor) return;

    const { text } = getContextText();
    const cleanText = text.replace(/<[^>]+>/g, '').trim();

    if (cleanText.length < 5) {
      setStatus('error');
      setActiveAction(action);
      const msg = L({
        en: 'Please write or select some text in the editor before applying AI actions.',
        ar: 'يرجى كتابة نص أو تحديد مقطع في المحرر أولاً قبل استخدام أدوات الذكاء الاصطناعي.',
        es: 'Por favor, escribe o selecciona texto en el editor antes de usar las herramientas de IA.',
      });
      setErrorMessage(msg);
      triggerToast(msg);
      return;
    }

    setStatus('loading');
    setActiveAction(action);
    setResult('');
    setErrorMessage('');

    try {
      const payload: AIRequest = {
        action: action.id,
        text,
        modelId: selectedModelId,
        title: currentBook.metadata.title,
        bookTitle: currentBook.metadata.title,
        description: currentBook.metadata.description || currentBook.metadata.subtitle || '',
        author: currentBook.metadata.author,
        category: currentBook.metadata.genre || 'General',
        genre: currentBook.metadata.genre || 'General',
        chapterTitle: activeChapter?.title,
        language: currentBook.metadata.language,
      };

      const response = await runAIAction(payload);
      setResult(response.result);
      setStatus('success');

      setTimeout(() => {
        resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to generate response.';
      setErrorMessage(msg);
      triggerToast(msg);
    }
  }, [editor, getContextText, selectedModelId, currentBook.metadata, activeChapter?.title, lang, triggerToast]);

  // Insert into Document: Replace selection or insert at current cursor position
  const handleInsertIntoDocument = useCallback(() => {
    if (!editor || !result) return;
    const htmlContent = textToHtml(result);
    const { empty } = editor.state.selection;

    if (!empty) {
      editor.chain().focus().deleteSelection().insertContent(htmlContent).run();
    } else {
      editor.chain().focus().insertContent(htmlContent).run();
    }

    triggerToast(L({
      en: '✨ Text inserted into active document!',
      ar: '✨ تم إدراج النص في المستند بنجاح!',
      es: '✨ ¡Texto insertado en el documento activo!',
    }));

    setStatus('idle');
    setResult('');
    setActiveAction(null);
  }, [editor, result, lang, triggerToast]);

  // Append generated content to the end of the chapter
  const handleAppendToEnd = useCallback(() => {
    if (!editor || !result) return;
    const htmlContent = textToHtml(result);

    editor
      .chain()
      .focus()
      .setTextSelection(editor.state.doc.content.size)
      .insertContent(htmlContent)
      .run();

    triggerToast(L({
      en: '✨ Appended to end of chapter!',
      ar: '✨ تمت إضافة النص إلى نهاية الفصل!',
      es: '✨ ¡Añadido al final del capítulo!',
    }));

    setStatus('idle');
    setResult('');
    setActiveAction(null);
  }, [editor, result, lang, triggerToast]);

  // Copy result to clipboard
  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const handleReset = () => {
    setStatus('idle');
    setResult('');
    setErrorMessage('');
    setActiveAction(null);
  };

  if (!isOpen) return null;

  const currentModel = ALL_MODELS[selectedModelId] || ALL_MODELS[DEFAULT_MODEL_ID];

  return (
    <aside
      dir={isRtlLayout ? 'rtl' : 'ltr'}
      className={cn(
        'w-[310px] shrink-0 flex flex-col h-full',
        'border-s border-zinc-200/80 dark:border-zinc-800/80',
        'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl',
        'overflow-hidden shadow-2xl z-20'
      )}
    >
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>{L({ en: 'AI Studio Assistant', ar: 'مساعد الاستوديو الذكي', es: 'Asistente IA de Estudio' })}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-600 dark:text-sky-400 font-extrabold border border-sky-500/30">
                PRO
              </span>
            </h2>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-500" />
              <span>{currentModel.label}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          title="Close AI Assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Toast Notification Banner ───────────────────────────────────────── */}
      {toastMessage && (
        <div className="mx-3 mt-2.5 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-[11px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150 shrink-0">
          <Info className="w-4 h-4 text-sky-500 shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* ── Model Selector Section ─────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-1 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <span>{L({ en: 'AI Model & Provider', ar: 'نموذج ومزود الذكاء الاصطناعي', es: 'Modelo y Proveedor IA' })}</span>
          <span className="text-[9px] lowercase font-normal text-zinc-400">/api/generate</span>
        </div>
        <ModelSelector selectedId={selectedModelId} onChange={handleModelSelect} />
      </div>

      {/* ── Quick Hint Card ─────────────────────────────────────────────────── */}
      <div className="mx-3 my-2 px-3 py-2 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/80 shrink-0">
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex items-start gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
          <span>
            {L({
              en: 'Select text in the editor to target specific passages, or run across the current active chapter.',
              ar: 'حدد نصًا في المحرر لاستهداف فقرة محددة، أو قم بالتشغيل على كامل الفصل النشط.',
              es: 'Selecciona texto en el editor para un pasaje específico o ejecuta sobre el capítulo actual.',
            })}
          </span>
        </p>
      </div>

      {/* ── Scrollable Body Area ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3.5 min-h-0">

        {/* ── IDLE: Quick Actions Grid ── */}
        {status === 'idle' && (
          <>
            <div>
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {L({ en: 'Quick Actions', ar: 'الإجراءات السريعة', es: 'Acciones Rápidas' })}
                </span>
                <span className="text-[10px] font-semibold text-sky-500">4 Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRIMARY_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => executeAction(action)}
                    className={cn(
                      'flex flex-col items-start gap-2 p-3 rounded-2xl border text-start transition-all',
                      'hover:scale-[1.02] hover:shadow-md active:scale-[0.98]',
                      action.bg
                    )}
                  >
                    <span className={cn('w-8 h-8 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/40 dark:border-zinc-800', action.accent)}>
                      {action.icon}
                    </span>
                    <div>
                      <span className={cn('block text-xs font-bold leading-tight', action.accent)}>
                        {L(action.label)}
                      </span>
                      <span className="block text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">
                        {L(action.desc)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Expandable More Tools / Translations ── */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowMoreTools((prev) => !prev)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-sky-500" />
                  <span>{L({ en: 'Translations & Structure', ar: 'الترجمة والهيكلة', es: 'Traducción y Estructura' })}</span>
                </span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-150', showMoreTools && 'rotate-180')} />
              </button>

              {showMoreTools && (
                <div className="mt-2 space-y-1 animate-in fade-in duration-150">
                  {SECONDARY_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => executeAction(action)}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/70 dark:hover:border-zinc-800 transition-all text-start group"
                    >
                      <span className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shrink-0 transition-transform group-hover:scale-105', action.accent)}>
                        {action.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {L(action.label)}
                        </span>
                        <span className="block text-[9.5px] text-zinc-400 truncate">
                          {L(action.desc)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── LOADING: Generation Progress ── */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 opacity-20 animate-ping" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
            </div>
            <div className="space-y-1.5 px-4">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {L({ en: 'Synthesizing with AI…', ar: 'جارٍ التوليد والمعالجة الذكية…', es: 'Generando con IA…' })}
              </p>
              {activeAction && (
                <div className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border', activeAction.bg, activeAction.accent)}>
                  {activeAction.icon}
                  <span>{L(activeAction.label)}</span>
                </div>
              )}
              <p className="text-[10px] text-zinc-400">
                {currentModel.label} ({currentModel.provider.toUpperCase()})
              </p>
            </div>
          </div>
        )}

        {/* ── ERROR: Error Notification & Retry ── */}
        {status === 'error' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  {L({ en: 'Generation Failed', ar: 'تعذر التوليد', es: 'Error de Generación' })}
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{L({ en: 'Try Again or Switch Model', ar: 'حاول مجددًا أو غيّر النموذج', es: 'Reintentar o Cambiar Modelo' })}</span>
            </button>
          </div>
        )}

        {/* ── SUCCESS: Result Inspection & Insertion ── */}
        {status === 'success' && result && (
          <div ref={resultContainerRef} className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-500 to-purple-600 flex items-center justify-center text-white text-[10px]">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {L({ en: 'AI Output', ar: 'النتيجة المولدة', es: 'Resultado de IA' })}
                </span>
              </div>
              {activeAction && (
                <span className={cn('text-[9.5px] font-bold px-2 py-0.5 rounded-full border', activeAction.bg, activeAction.accent)}>
                  {L(activeAction.label)}
                </span>
              )}
            </div>

            {/* Generated Text View Container */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-sans shadow-inner selection:bg-sky-500/20">
              {result}
            </div>

            {/* Primary Action: One-Click Insert into TipTap Document */}
            <button
              type="button"
              onClick={handleInsertIntoDocument}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>{L({ en: 'Insert into Document', ar: 'إدراج في المستند (مكان المؤشر)', es: 'Insertar en el Documento' })}</span>
            </button>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleAppendToEnd}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/60 dark:border-zinc-700/60"
                title="Append to end of chapter"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-500" />
                <span>{L({ en: 'Append End', ar: 'في النهاية', es: 'Al Final' })}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/60 dark:border-zinc-700/60"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">{L({ en: 'Copied', ar: 'تم', es: 'Listo' })}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{L({ en: 'Copy', ar: 'نسخ', es: 'Copiar' })}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/60 dark:border-zinc-700/60"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                <span>{L({ en: 'New', ar: 'جديد', es: 'Nuevo' })}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Status Bar ────────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full animate-pulse', PROVIDER_STYLES[currentModel.provider].dot)} />
          <span className="font-semibold text-zinc-600 dark:text-zinc-300">{currentModel.label}</span>
        </div>
        <span className="font-mono text-[9px]">v2.5 Universal</span>
      </div>
    </aside>
  );
}
