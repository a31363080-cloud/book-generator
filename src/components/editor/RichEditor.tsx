'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { useBook } from '@/context/BookContext';
import { EditorToolbar } from './EditorToolbar';
import { BubbleToolbar } from './BubbleToolbar';
import { StatusBar } from './StatusBar';
import { FocusModeOverlay } from './FocusModeOverlay';
import { AIAssistantPanel } from '@/components/ai/AIAssistantPanel';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEFAULT_MODEL_ID, ALL_MODELS } from '@/lib/ai-engine';

interface RichEditorProps {
  /** Called once the TipTap editor instance is ready */
  onEditorReady?: (editor: Editor) => void;
}

export function RichEditor({ onEditorReady }: RichEditorProps) {
  const { activeChapter, updateChapterContent, isFocusMode, font, currentBook, isRtlLayout } = useBook();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);

  const isRtlBook =
    currentBook.metadata.direction === 'rtl' ||
    currentBook.metadata.language === 'ar' ||
    isRtlLayout;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: isRtlBook
          ? 'ابدأ في كتابة مسودة الفصل أو قصتك هنا... (يدعم اختصارات ماركداون والجداول والذكاء الاصطناعي)'
          : 'Type your chapter here… (Markdown shortcuts supported, or highlight text for AI Edit)',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount,
      Typography,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: activeChapter?.content || '<p></p>',
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[520px] leading-relaxed text-base',
          isRtlBook && 'rtl text-right font-arabic'
        ),
        dir: isRtlBook ? 'rtl' : 'ltr',
      },
    },
    onUpdate: ({ editor }) => {
      if (activeChapter) {
        updateChapterContent(activeChapter.id, editor.getHTML());
      }
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Sync content when active chapter changes
  useEffect(() => {
    if (editor && activeChapter) {
      const currentHtml = editor.getHTML();
      if (currentHtml !== activeChapter.content) {
        editor.commands.setContent(activeChapter.content || '<p></p>', false);
      }
    }
  }, [activeChapter?.id, editor]);

  const fontClass: Record<string, string> = {
    editorial: 'font-editorial',
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
    literata: 'font-literata',
    arabic: 'font-arabic',
  };

  const currentModel = ALL_MODELS[selectedModelId] || ALL_MODELS[DEFAULT_MODEL_ID];

  return (
    <FocusModeOverlay>
      <div
        className={cn('flex flex-row flex-1 h-full min-h-0', fontClass[font] ?? 'font-sans')}
        dir={isRtlBook ? 'rtl' : 'ltr'}
      >
        {/* Main editor column */}
        <div className="flex flex-col flex-1 min-w-0 bg-background">
          {/* Sticky Toolbar */}
          {!isFocusMode && (
            <EditorToolbar
              editor={editor}
              aiPanelOpen={isAIPanelOpen}
              onToggleAIPanel={() => setIsAIPanelOpen((v) => !v)}
              selectedModelId={selectedModelId}
              onModelChange={setSelectedModelId}
            />
          )}

          {/* Floating Bubble Menu with Ask AI button */}
          <BubbleToolbar
            editor={editor}
            onOpenAI={() => setIsAIPanelOpen(true)}
          />

          {/* Notion-style Centered Paper Canvas */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-10 sm:py-12 flex justify-center bg-zinc-50/40 dark:bg-zinc-950/40">
            <div
              className={cn(
                'w-full max-w-3xl bg-white dark:bg-zinc-900/90 p-8 sm:p-14 rounded-3xl shadow-sm border border-zinc-200/70 dark:border-zinc-800/80 min-h-full transition-all',
                isRtlBook && 'font-arabic'
              )}
              dir={isRtlBook ? 'rtl' : 'ltr'}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Status Bar */}
          {!isFocusMode && <StatusBar activeChapter={activeChapter} />}
        </div>

        {/* Universal Multi-Provider AI Assistant Side Panel */}
        {!isFocusMode && (
          <AIAssistantPanel
            editor={editor}
            isOpen={isAIPanelOpen}
            onClose={() => setIsAIPanelOpen(false)}
            initialModelId={selectedModelId}
            onModelChange={setSelectedModelId}
          />
        )}
      </div>

      {/* Floating AI button (visible when panel is closed, not in focus mode) */}
      {!isFocusMode && !isAIPanelOpen && (
        <button
          type="button"
          onClick={() => setIsAIPanelOpen(true)}
          title={`AI Assistant (${currentModel.label})`}
          className={cn(
            'fixed bottom-16 z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl shadow-sky-600/25',
            'bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600',
            'text-white text-xs font-bold',
            'hover:shadow-indigo-500/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200',
            'border border-white/25 backdrop-blur-md',
            isRtlBook ? 'left-6' : 'right-6'
          )}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{isRtlLayout ? 'المساعد الذكي (AI)' : 'AI Assistant'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 font-normal hidden sm:inline">
            {currentModel.label}
          </span>
        </button>
      )}
    </FocusModeOverlay>
  );
}