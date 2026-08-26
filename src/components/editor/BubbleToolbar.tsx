'use client';

import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading2,
  Quote,
  Highlighter,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BubbleToolbarProps {
  editor: Editor | null;
  onOpenAI?: () => void;
}

export function BubbleToolbar({ editor, onOpenAI }: BubbleToolbarProps) {
  if (!editor) return null;

  const BubbleButton = ({
    isActive = false,
    onClick,
    icon,
    title,
    highlight = false,
  }: {
    isActive?: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    highlight?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded-lg transition-colors text-xs flex items-center justify-center',
        highlight
          ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold px-2'
          : isActive
          ? 'bg-sky-500 text-white font-bold'
          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
      )}
    >
      {icon}
    </button>
  );

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150 }}
      className="flex items-center gap-1 p-1 bg-zinc-950/95 text-white rounded-2xl shadow-2xl border border-zinc-800 backdrop-blur-xl"
    >
      {onOpenAI && (
        <>
          <button
            type="button"
            onClick={onOpenAI}
            title="Ask AI on Selected Text"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Edit</span>
          </button>
          <div className="h-4 w-px bg-zinc-800 mx-0.5" />
        </>
      )}

      <BubbleButton
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Bold className="w-3.5 h-3.5" />}
        title="Bold"
      />
      <BubbleButton
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Italic className="w-3.5 h-3.5" />}
        title="Italic"
      />
      <BubbleButton
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        icon={<UnderlineIcon className="w-3.5 h-3.5" />}
        title="Underline"
      />
      <BubbleButton
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Strikethrough className="w-3.5 h-3.5" />}
        title="Strikethrough"
      />
      <BubbleButton
        isActive={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        icon={<Highlighter className="w-3.5 h-3.5 text-amber-400" />}
        title="Highlight"
      />
      <BubbleButton
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={<Heading2 className="w-3.5 h-3.5" />}
        title="Heading 2"
      />
      <BubbleButton
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<Quote className="w-3.5 h-3.5" />}
        title="Blockquote"
      />
      <BubbleButton
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={<Code className="w-3.5 h-3.5" />}
        title="Code"
      />
    </BubbleMenu>
  );
}