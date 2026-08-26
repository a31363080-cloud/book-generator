'use client';

import React from 'react';
import { useBook } from '@/context/BookContext';
import { Minimize2, Sun, Moon, Coffee } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';

interface FocusModeOverlayProps {
  children: React.ReactNode;
}

export function FocusModeOverlay({ children }: FocusModeOverlayProps) {
  const { isFocusMode, toggleFocusMode, activeChapter, theme, setTheme } = useBook();

  if (!isFocusMode) return <>{children}</>;

  const themeIcons = {
    light: <Sun className="w-4 h-4 text-amber-500" />,
    sepia: <Coffee className="w-4 h-4 text-amber-700" />,
    dark: <Moon className="w-4 h-4 text-indigo-400" />,
    night: <Moon className="w-4 h-4 text-purple-400" />,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background text-foreground flex flex-col items-center animate-in fade-in duration-300">
      {/* Floating Minimalist Top HUD */}
      <div className="fixed top-4 right-6 flex items-center gap-3 p-1.5 px-3 rounded-full bg-slate-900/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-xl text-slate-200 z-50 text-xs transition-opacity duration-300 hover:opacity-100 opacity-60">
        <span className="font-mono text-[11px] text-slate-400">
          {activeChapter?.wordCount.toLocaleString() || 0} words
        </span>

        <div className="h-3 w-px bg-slate-700" />

        <Dropdown
          align="right"
          trigger={
            <button className="p-1 hover:text-white rounded transition-colors">
              {themeIcons[theme]}
            </button>
          }
          items={[
            { id: 'focus-light', label: 'Light', onClick: () => setTheme('light') },
            { id: 'focus-sepia', label: 'Sepia', onClick: () => setTheme('sepia') },
            { id: 'focus-dark', label: 'Dark', onClick: () => setTheme('dark') },
            { id: 'focus-night', label: 'Night', onClick: () => setTheme('night') },
          ]}
        />

        <button
          onClick={() => toggleFocusMode(false)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-all font-medium text-[11px]"
          title="Exit Focus Mode (Esc)"
        >
          <Minimize2 className="w-3 h-3" />
          <span>Exit Focus (ESC)</span>
        </button>
      </div>

      {/* Distraction Free Canvas */}
      <div className="w-full max-w-3xl min-h-screen py-16 px-6 sm:px-12 flex flex-col justify-start">
        {children}
      </div>
    </div>
  );
}