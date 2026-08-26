'use client';

import React from 'react';
import { useBook } from '@/context/BookContext';
import { EditorFont, UiLanguage } from '@/types/book';
import {
  PanelLeftOpen,
  Book,
  Download,
  Maximize2,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Check,
  Loader2,
  Type,
  ChevronDown,
  Globe,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';

interface TopNavProps {
  onOpenExport: () => void;
  onOpenCoverStudio: () => void;
  onOpenBookSelector: () => void;
  onOpenStats: () => void;
  onOpenAIWizard?: () => void;
}

export function TopNav({
  onOpenExport,
  onOpenCoverStudio,
  onOpenBookSelector,
  onOpenStats,
  onOpenAIWizard,
}: TopNavProps) {
  const {
    currentBook,
    isSidebarOpen,
    toggleSidebar,
    theme,
    setTheme,
    font,
    setFont,
    uiLanguage,
    setUiLanguage,
    t,
    toggleFocusMode,
    isSaving,
    totalStats,
  } = useBook();

  const themeIcons = {
    light: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    sepia: <Coffee className="w-3.5 h-3.5 text-amber-700" />,
    dark: <Moon className="w-3.5 h-3.5 text-sky-400" />,
    night: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
  };

  const languageLabels: Record<UiLanguage, { label: string; flag: string }> = {
    en: { label: 'English', flag: '🇬🇧' },
    ar: { label: 'العربية (RTL)', flag: '🇸🇦' },
    es: { label: 'Español', flag: '🇪🇸' },
  };

  return (
    <header className="h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Sidebar Toggle, App Brand & Book Switcher */}
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            title={t.tableOfContents}
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Book className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-tight text-zinc-900 dark:text-zinc-100">
                {t.appName}
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                {t.proBadge}
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800 mx-1 hidden md:block" />

        {/* Current Book Switcher */}
        <button
          onClick={onOpenBookSelector}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80 transition-all max-w-[200px] sm:max-w-xs truncate shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span className="truncate">{currentBook.metadata.title}</span>
          <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0 ms-0.5" />
        </button>
      </div>

      {/* Center: Live Save Indicator & Quick Word Count */}
      <div className="hidden lg:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
              <span className="text-[11px]">{t.savingChanges}</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px]">{t.allSaved}</span>
            </>
          )}
        </div>

        <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />

        <button
          onClick={onOpenStats}
          className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalStats.words.toLocaleString()}
          </span>
          <span>{t.words}</span>
          <span className="text-zinc-400">({totalStats.readingTime} {t.minRead})</span>
        </button>
      </div>

      {/* Right: Controls & Export */}
      <div className="flex items-center gap-1.5">
        {/* Language Switcher */}
        <Dropdown
          align="right"
          trigger={
            <button
              title="UI Language"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-800 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{languageLabels[uiLanguage].flag}</span>
              <span className="hidden xl:inline">{languageLabels[uiLanguage].label}</span>
            </button>
          }
          items={[
            {
              id: 'lang-en',
              label: 'English 🇬🇧',
              onClick: () => setUiLanguage('en'),
            },
            {
              id: 'lang-ar',
              label: 'العربية 🇸🇦 (RTL)',
              onClick: () => setUiLanguage('ar'),
            },
            {
              id: 'lang-es',
              label: 'Español 🇪🇸',
              onClick: () => setUiLanguage('es'),
            },
          ]}
        />

        {/* Font Picker */}
        <Dropdown
          align="right"
          trigger={
            <button
              title="Typography Font"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-800 transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline capitalize">{font}</span>
            </button>
          }
          items={[
            { id: 'font-editorial', label: 'Editorial (Playfair)', onClick: () => setFont('editorial') },
            { id: 'font-serif', label: 'Serif (Merriweather)', onClick: () => setFont('serif') },
            { id: 'font-sans', label: 'Sans-Serif (Inter)', onClick: () => setFont('sans') },
            { id: 'font-literata', label: 'Literata (Book Style)', onClick: () => setFont('literata') },
            { id: 'font-arabic', label: 'Arabic (Cairo / Amiri)', onClick: () => setFont('arabic') },
            { id: 'font-mono', label: 'Monospace (JetBrains)', onClick: () => setFont('mono') },
          ]}
        />

        {/* Theme Picker */}
        <Dropdown
          align="right"
          trigger={
            <button
              title={t.lightTheme}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-800 transition-colors"
            >
              {themeIcons[theme]}
            </button>
          }
          items={[
            { id: 'theme-light', label: t.lightTheme, icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, onClick: () => setTheme('light') },
            { id: 'theme-sepia', label: t.sepiaTheme, icon: <Coffee className="w-3.5 h-3.5 text-amber-700" />, onClick: () => setTheme('sepia') },
            { id: 'theme-dark', label: t.darkTheme, icon: <Moon className="w-3.5 h-3.5 text-sky-400" />, onClick: () => setTheme('dark') },
            { id: 'theme-night', label: t.nightTheme, icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />, onClick: () => setTheme('night') },
          ]}
        />

        {/* Focus Mode Trigger */}
        <button
          onClick={() => toggleFocusMode(true)}
          title={t.zenMode}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-800 transition-colors hidden sm:flex items-center gap-1 text-xs"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{t.zenMode}</span>
        </button>

        {/* AI Book Generator Wizard */}
        {onOpenAIWizard && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Wand2 className="w-3.5 h-3.5 text-purple-500" />}
            onClick={onOpenAIWizard}
            className="rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100"
          >
            <span>AI Book Studio</span>
          </Button>
        )}

        {/* Cover Studio Button */}
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-sky-500" />}
          onClick={onOpenCoverStudio}
          className="hidden md:inline-flex rounded-xl"
        >
          {t.coverStudio}
        </Button>

        {/* Prominent Export Button */}
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={onOpenExport}
          className="shadow-md shadow-sky-600/25 rounded-xl font-bold"
        >
          {t.exportBook}
        </Button>
      </div>
    </header>
  );
}