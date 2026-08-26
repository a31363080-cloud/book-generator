'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { useBook } from '@/context/BookContext';
import { CoverConfig, CoverPattern, CoverTemplate, EditorFont } from '@/types/book';
import { CoverCanvas } from './CoverCanvas';
import { BookMockup3D } from './BookMockup3D';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import {
  Download,
  Image as ImageIcon,
  Palette,
  Type,
  Layout,
  Upload,
  Check,
} from 'lucide-react';
import { saveAs } from 'file-saver';

interface CoverStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoverStudioModal({ isOpen, onClose }: CoverStudioModalProps) {
  const { currentBook, updateCover, t } = useBook();
  const [activeTab, setActiveTab] = useState<'templates' | 'colors' | 'typography' | 'image'>(
    'templates'
  );
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [coverState, setCoverState] = useState<CoverConfig>({
    ...currentBook.metadata.coverConfig,
    title: currentBook.metadata.title,
    subtitle: currentBook.metadata.subtitle || '',
    author: currentBook.metadata.author,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const templates: {
    id: CoverTemplate;
    name: string;
    description: string;
    config: Partial<CoverConfig>;
  }[] = [
    {
      id: 'scifi',
      name: 'Sci-Fi Starlight',
      description: 'Deep cosmic gradient with stellar particles',
      config: {
        bgColor1: '#0f172a',
        bgColor2: '#3b0764',
        gradientType: 'linear',
        gradientAngle: 135,
        textColor: '#f8fafc',
        accentColor: '#38bdf8',
        fontFamily: 'editorial',
        pattern: 'stars',
        badgeText: 'SPECULATIVE FICTION',
      },
    },
    {
      id: 'minimal',
      name: 'Modern Minimal',
      description: 'Clean slate with striking contrast',
      config: {
        bgColor1: '#18181b',
        bgColor2: '#09090b',
        gradientType: 'solid',
        textColor: '#fafafa',
        accentColor: '#10b981',
        fontFamily: 'sans',
        pattern: 'dots',
        badgeText: 'FIRST EDITION',
      },
    },
    {
      id: 'editorial',
      name: 'Editorial Classic',
      description: 'Sophisticated royal navy and gold accents',
      config: {
        bgColor1: '#022c22',
        bgColor2: '#064e3b',
        gradientType: 'linear',
        gradientAngle: 180,
        textColor: '#fef08a',
        accentColor: '#facc15',
        fontFamily: 'editorial',
        pattern: 'none',
        badgeText: 'AUTHOR MASTERWORK',
      },
    },
    {
      id: 'bold',
      name: 'Crimson Thriller',
      description: 'High impact deep red to obsidian fade',
      config: {
        bgColor1: '#4c0519',
        bgColor2: '#020617',
        gradientType: 'linear',
        gradientAngle: 145,
        textColor: '#ffffff',
        accentColor: '#f43f5e',
        fontFamily: 'editorial',
        pattern: 'grid',
        badgeText: 'BESTSELLER',
      },
    },
    {
      id: 'vintage',
      name: 'Warm Parchment',
      description: 'Warm sepia tones and classical typography',
      config: {
        bgColor1: '#78350f',
        bgColor2: '#451a03',
        gradientType: 'linear',
        gradientAngle: 120,
        textColor: '#fef3c7',
        accentColor: '#f59e0b',
        fontFamily: 'serif',
        pattern: 'none',
        badgeText: 'CLASSICAL SERIES',
      },
    },
  ];

  const handleApplyTemplate = (tmpl: (typeof templates)[0]) => {
    setCoverState((prev) => ({
      ...prev,
      template: tmpl.id,
      ...tmpl.config,
    }));
  };

  const handleSaveToBook = () => {
    updateCover(coverState);
    onClose();
  };

  const handleDownloadCover = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const filename = `${(currentBook.metadata.title || 'book_cover')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')}_cover.png`;
          saveAs(blob, filename);
        }
      }, 'image/png');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setCoverState((prev) => ({
          ...prev,
          uploadedImageUrl: ev.target?.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.coverTitle}
      subtitle={t.coverTitle}
      maxWidth="5xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Preview (3D Mockup / 2D Flat) */}
        <div className="lg:col-span-5 flex flex-col items-center bg-slate-100 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-4 text-xs font-semibold select-none">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                viewMode === '3d'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.mockup3D}
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                viewMode === '2d'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.flat2D}
            </button>
          </div>

          <div className="w-full flex items-center justify-center min-h-[340px]">
            {viewMode === '3d' ? (
              <BookMockup3D config={coverState} />
            ) : (
              <div className="w-60 shadow-xl rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <CoverCanvas
                  config={coverState}
                  width={400}
                  height={600}
                  onCanvasReady={(c) => (canvasRef.current = c)}
                />
              </div>
            )}
          </div>

          {/* Hidden Canvas for High-Res PNG Exports */}
          <div className="hidden">
            <CoverCanvas
              config={coverState}
              width={800}
              height={1200}
              onCanvasReady={(c) => (canvasRef.current = c)}
            />
          </div>

          <div className="w-full flex items-center justify-center gap-2 mt-4">
            <Button
              size="xs"
              variant="outline"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownloadCover}
            >
              {t.exportCoverPng}
            </Button>
          </div>
        </div>

        {/* Right: Customization Controls & Tabs */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <Tabs
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            tabs={[
              { id: 'templates', label: t.coverPresets, icon: <Layout className="w-4 h-4" /> },
              { id: 'colors', label: t.colorGradient, icon: <Palette className="w-4 h-4" /> },
              { id: 'typography', label: t.typography, icon: <Type className="w-4 h-4" /> },
              { id: 'image', label: t.uploadArtwork, icon: <ImageIcon className="w-4 h-4" /> },
            ]}
          />

          {/* Tab 1: Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.coverPresets}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      coverState.template === tmpl.id
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {tmpl.name}
                      </span>
                      {coverState.template === tmpl.id && (
                        <Check className="w-4 h-4 text-sky-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {tmpl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Colors & Gradient */}
          {activeTab === 'colors' && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.primaryColor}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={coverState.bgColor1}
                      onChange={(e) =>
                        setCoverState({ ...coverState, bgColor1: e.target.value })
                      }
                      className="w-8 h-8 rounded border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={coverState.bgColor1}
                      onChange={(e) =>
                        setCoverState({ ...coverState, bgColor1: e.target.value })
                      }
                      className="w-full text-xs font-mono px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.secondaryColor}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={coverState.bgColor2}
                      onChange={(e) =>
                        setCoverState({ ...coverState, bgColor2: e.target.value })
                      }
                      className="w-8 h-8 rounded border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={coverState.bgColor2}
                      onChange={(e) =>
                        setCoverState({ ...coverState, bgColor2: e.target.value })
                      }
                      className="w-full text-xs font-mono px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'solid'] as const).map((gType) => (
                  <button
                    key={gType}
                    onClick={() => setCoverState({ ...coverState, gradientType: gType })}
                    className={`py-1.5 text-xs font-semibold capitalize rounded-lg border transition-colors ${
                      coverState.gradientType === gType
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {gType}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.textureOverlay}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'stars', 'dots', 'grid'] as CoverPattern[]).map((pat) => (
                    <button
                      key={pat}
                      onClick={() => setCoverState({ ...coverState, pattern: pat })}
                      className={`py-1.5 text-xs font-semibold capitalize rounded-lg border transition-colors ${
                        coverState.pattern === pat
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {pat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Typography & Text */}
          {activeTab === 'typography' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.typography}
                </label>
                <select
                  value={coverState.fontFamily}
                  onChange={(e) =>
                    setCoverState({
                      ...coverState,
                      fontFamily: e.target.value as EditorFont,
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                >
                  <option value="editorial">Editorial (Playfair Display)</option>
                  <option value="arabic">Arabic (Cairo / Amiri)</option>
                  <option value="serif">Serif (Merriweather)</option>
                  <option value="sans">Sans-Serif (Inter)</option>
                  <option value="literata">Literata (Book Typeface)</option>
                  <option value="mono">Monospace (JetBrains)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.textColor}
                  </label>
                  <input
                    type="color"
                    value={coverState.textColor}
                    onChange={(e) =>
                      setCoverState({ ...coverState, textColor: e.target.value })
                    }
                    className="w-full h-8 rounded border cursor-pointer bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.primaryColor}
                  </label>
                  <input
                    type="color"
                    value={coverState.accentColor}
                    onChange={(e) =>
                      setCoverState({ ...coverState, accentColor: e.target.value })
                    }
                    className="w-full h-8 rounded border cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.badgeLabel}
                </label>
                <input
                  type="text"
                  placeholder="e.g. SPECIAL EDITION"
                  value={coverState.badgeText || ''}
                  onChange={(e) =>
                    setCoverState({ ...coverState, badgeText: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Tab 4: Image Artwork Upload */}
          {activeTab === 'image' && (
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.uploadArtwork}
              </label>

              <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-sky-500 transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                <Upload className="w-6 h-6 text-slate-400" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {t.browseImage}
                </p>
                <p className="text-[10px] text-slate-400">PNG, JPG, WebP (1600x2400 recommended)</p>
                <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-sm">
                  <span>{t.browseImage}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {coverState.uploadedImageUrl && (
                <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                    {t.uploadArtwork}
                  </span>
                  <Button
                    size="xs"
                    variant="danger"
                    onClick={() =>
                      setCoverState({ ...coverState, uploadedImageUrl: undefined })
                    }
                  >
                    {t.removeImage}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button
              variant="primary"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={handleSaveToBook}
            >
              {t.applyCover}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}