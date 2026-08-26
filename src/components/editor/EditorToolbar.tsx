'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Sparkles,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo,
  Redo,
  Highlighter,
  Palette,
  RemoveFormatting,
  Table as TableIcon,
  Columns,
  Rows,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown } from '../ui/Dropdown';
import { useBook } from '@/context/BookContext';
import { ALL_MODELS, DEFAULT_MODEL_ID, PROVIDER_GROUPS, ModelConfig } from '@/lib/ai-engine';

interface EditorToolbarProps {
  editor: Editor | null;
  aiPanelOpen?: boolean;
  onToggleAIPanel?: () => void;
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
}

export function EditorToolbar({
  editor,
  aiPanelOpen = false,
  onToggleAIPanel,
  selectedModelId = DEFAULT_MODEL_ID,
  onModelChange,
}: EditorToolbarProps) {
  const { t, isRtlLayout } = useBook();

  if (!editor) return null;

  const currentModel = ALL_MODELS[selectedModelId] || ALL_MODELS[DEFAULT_MODEL_ID];

  const ToolbarButton = ({
    isActive = false,
    onClick,
    icon,
    title,
    disabled = false,
  }: {
    isActive?: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded-lg transition-colors text-xs flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none',
        isActive
          ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/30'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      )}
    >
      {icon}
    </button>
  );

  const colors = [
    { name: 'Default', value: 'inherit' },
    { name: 'Sky Blue', value: '#0284c7' },
    { name: 'Emerald Green', value: '#059669' },
    { name: 'Amber Gold', value: '#d97706' },
    { name: 'Rose Red', value: '#e11d48' },
    { name: 'Purple', value: '#7c3aed' },
  ];

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 select-none">
      {/* History */}
      <div className="flex items-center gap-0.5 pe-1.5 border-e border-slate-200 dark:border-slate-800">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<Undo className={cn('w-4 h-4', isRtlLayout && 'scale-x-[-1]')} />}
          title={t.undo}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<Redo className={cn('w-4 h-4', isRtlLayout && 'scale-x-[-1]')} />}
          title={t.redo}
        />
      </div>

      {/* Headings */}
      <div className="flex items-center gap-0.5 px-1.5 border-e border-slate-200 dark:border-slate-800">
        <ToolbarButton
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={<Heading1 className="w-4 h-4" />}
          title={t.heading1}
        />
        <ToolbarButton
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={<Heading2 className="w-4 h-4" />}
          title={t.heading2}
        />
        <ToolbarButton
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={<Heading3 className="w-4 h-4" />}
          title={t.heading3}
        />
      </div>

      {/* Basic Marks */}
      <div className="flex items-center gap-0.5 px-1.5 border-e border-slate-200 dark:border-slate-800">
        <ToolbarButton
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="w-4 h-4" />}
          title={t.bold}
        />
        <ToolbarButton
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="w-4 h-4" />}
          title={t.italic}
        />
        <ToolbarButton
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={<UnderlineIcon className="w-4 h-4" />}
          title={t.underline}
        />
        <ToolbarButton
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<Strikethrough className="w-4 h-4" />}
          title={t.strike}
        />
        <ToolbarButton
          isActive={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={<Code className="w-4 h-4" />}
          title={t.code}
        />
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-1.5 border-e border-slate-200 dark:border-slate-800">
        <ToolbarButton
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          icon={<AlignLeft className="w-4 h-4" />}
          title={t.alignLeft}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          icon={<AlignCenter className="w-4 h-4" />}
          title={t.alignCenter}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          icon={<AlignRight className="w-4 h-4" />}
          title={t.alignRight}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          icon={<AlignJustify className="w-4 h-4" />}
          title={t.alignJustify}
        />
      </div>

      {/* Lists & Blocks */}
      <div className="flex items-center gap-0.5 px-1.5 border-e border-slate-200 dark:border-slate-800">
        <ToolbarButton
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List className="w-4 h-4" />}
          title={t.bulletList}
        />
        <ToolbarButton
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<ListOrdered className="w-4 h-4" />}
          title={t.orderedList}
        />
        <ToolbarButton
          isActive={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote className="w-4 h-4" />}
          title={t.blockquote}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<Minus className="w-4 h-4" />}
          title={t.horizontalRule}
        />
      </div>

      {/* Tables Suite */}
      <div className="flex items-center gap-0.5 px-1.5 border-e border-slate-200 dark:border-slate-800">
        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          icon={<TableIcon className="w-4 h-4 text-sky-500" />}
          title={t.insertTable}
        />
        <Dropdown
          align="left"
          trigger={
            <button
              title={t.tableTools}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
            >
              <Columns className="w-4 h-4 text-slate-500" />
            </button>
          }
          items={[
            {
              id: 'add-row-before',
              label: t.addRowAbove,
              icon: <Rows className="w-3.5 h-3.5" />,
              onClick: () => editor.chain().focus().addRowBefore().run(),
            },
            {
              id: 'add-row-after',
              label: t.addRowBelow,
              icon: <Rows className="w-3.5 h-3.5" />,
              onClick: () => editor.chain().focus().addRowAfter().run(),
            },
            {
              id: 'delete-row',
              label: t.deleteRow,
              icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
              danger: true,
              onClick: () => editor.chain().focus().deleteRow().run(),
            },
            'divider',
            {
              id: 'add-col-before',
              label: t.addColumnBefore,
              icon: <Columns className="w-3.5 h-3.5" />,
              onClick: () => editor.chain().focus().addColumnBefore().run(),
            },
            {
              id: 'add-col-after',
              label: t.addColumnAfter,
              icon: <Columns className="w-3.5 h-3.5" />,
              onClick: () => editor.chain().focus().addColumnAfter().run(),
            },
            {
              id: 'delete-col',
              label: t.deleteColumn,
              icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
              danger: true,
              onClick: () => editor.chain().focus().deleteColumn().run(),
            },
            'divider',
            {
              id: 'delete-table',
              label: t.deleteTable,
              icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />,
              danger: true,
              onClick: () => editor.chain().focus().deleteTable().run(),
            },
          ]}
        />
      </div>

      {/* Highlight, Color & RTL */}
      <div className="flex items-center gap-0.5 px-1.5">
        <ToolbarButton
          isActive={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          icon={<Highlighter className="w-4 h-4 text-amber-500" />}
          title={t.highlightText}
        />
        <Dropdown
          align="left"
          trigger={
            <button
              title={t.textColor}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
            >
              <Palette className="w-4 h-4 text-sky-500" />
            </button>
          }
          items={colors.map((c) => ({
            id: `color-${c.name}`,
            label: c.name,
            icon: (
              <span
                className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: c.value === 'inherit' ? 'currentColor' : c.value }}
              />
            ),
            onClick: () => {
              if (c.value === 'inherit') {
                editor.chain().focus().unsetColor().run();
              } else {
                editor.chain().focus().setColor(c.value).run();
              }
            },
          }))}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          icon={<RemoveFormatting className="w-4 h-4 text-slate-400 hover:text-rose-500" />}
          title={t.clearFormatting}
        />
      </div>

      {/* AI Assistant Toolbar Action & Model Switcher */}
      {onToggleAIPanel && (
        <div className="ms-auto flex items-center gap-1 ps-2 border-s border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onToggleAIPanel}
            title="AI Studio Assistant (Gemini / OpenAI / Claude / DeepSeek)"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm',
              aiPanelOpen
                ? 'bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white shadow-indigo-500/30'
                : 'bg-gradient-to-r from-sky-500/10 to-purple-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 border border-sky-500/30'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span className="hidden md:inline">AI Studio</span>
            <span className="text-[10px] opacity-75 hidden xl:inline">({currentModel.label})</span>
          </button>
        </div>
      )}
    </div>
  );
}