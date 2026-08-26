export type ChapterStatus = 'draft' | 'review' | 'complete';
export type UiLanguage = 'en' | 'ar' | 'es';
export type TextDirection = 'ltr' | 'rtl';

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML string
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  order: number;
  notes?: string;
  direction?: TextDirection;
  lastModified: number;
}

export type CoverTemplate = 'minimal' | 'bold' | 'editorial' | 'scifi' | 'vintage' | 'tech' | 'custom';
export type CoverPattern = 'none' | 'dots' | 'grid' | 'waves' | 'stars' | 'geometric';

export interface CoverConfig {
  title: string;
  subtitle: string;
  author: string;
  template: CoverTemplate;
  bgColor1: string;
  bgColor2: string;
  gradientType: 'linear' | 'radial' | 'solid';
  gradientAngle: number;
  textColor: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans' | 'mono' | 'editorial' | 'literata' | 'arabic';
  pattern: CoverPattern;
  uploadedImageUrl?: string;
  imageFit: 'cover' | 'contain' | 'center';
  badgeText?: string;
}

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  language: string; // 'en' | 'ar' | 'es' | etc.
  direction?: TextDirection; // 'ltr' | 'rtl'
  isbn?: string;
  publicationDate?: string;
  description: string;
  genre: string;
  tags: string[];
  targetWordCount: number;
  coverConfig: CoverConfig;
}

export interface Book {
  metadata: BookMetadata;
  chapters: Chapter[];
  activeChapterId: string;
  createdAt: number;
  updatedAt: number;
}

export type EditorTheme = 'light' | 'sepia' | 'dark' | 'night';
export type EditorFont = 'serif' | 'sans' | 'mono' | 'editorial' | 'literata' | 'arabic';

export type ExportFormat = 'epub' | 'docx' | 'pdf' | 'markdown' | 'html' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeCover: boolean;
  includeToc: boolean;
  selectedChapterIds: string[];
  customTitle?: string;
  customAuthor?: string;
}