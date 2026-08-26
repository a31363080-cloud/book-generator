'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Book,
  BookMetadata,
  Chapter,
  ChapterStatus,
  CoverConfig,
  EditorFont,
  EditorTheme,
  TextDirection,
  UiLanguage,
} from '@/types/book';
import { SAMPLE_BOOK } from '@/lib/sampleData';
import { countWords, generateId, slugify } from '@/lib/utils';
import {
  getBook,
  getStoredCurrentBookId,
  listBooks,
  saveBook,
  setStoredCurrentBookId,
  deleteBook as deleteBookStorage,
} from '@/lib/storage';
import { TranslationDict, translations } from '@/lib/i18n';

interface BookContextType {
  currentBook: Book;
  allBooks: BookMetadata[];
  activeChapter: Chapter | undefined;
  theme: EditorTheme;
  font: EditorFont;
  uiLanguage: UiLanguage;
  t: TranslationDict;
  isRtlLayout: boolean;
  isFocusMode: boolean;
  isSidebarOpen: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  totalStats: { words: number; chars: number; readingTime: number };

  // Language & Direction
  setUiLanguage: (lang: UiLanguage) => void;
  setBookDirection: (dir: TextDirection) => void;

  // Chapter Actions
  setActiveChapterId: (id: string) => void;
  updateChapterContent: (chapterId: string, content: string) => void;
  updateChapterTitle: (chapterId: string, title: string) => void;
  updateChapterStatus: (chapterId: string, status: ChapterStatus) => void;
  addChapter: (title?: string) => string;
  duplicateChapter: (chapterId: string) => void;
  deleteChapter: (chapterId: string) => void;
  reorderChapters: (startIndex: number, endIndex: number) => void;

  // Book & Metadata Actions
  updateMetadata: (meta: Partial<BookMetadata>) => void;
  updateCover: (cover: Partial<CoverConfig>) => void;
  switchBook: (bookId: string) => void;
  createNewBook: (title?: string, author?: string, lang?: string, dir?: TextDirection) => string;
  createBookWithChapters: (
    metadata: Partial<BookMetadata>,
    chapters: Array<{ title: string; content: string; status?: ChapterStatus }>
  ) => string;
  deleteCurrentBook: () => void;
  resetToSampleBook: () => void;

  // UI Actions
  setTheme: (theme: EditorTheme) => void;
  setFont: (font: EditorFont) => void;
  toggleFocusMode: (val?: boolean) => void;
  toggleSidebar: () => void;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [currentBook, setCurrentBook] = useState<Book>(SAMPLE_BOOK);
  const [allBooks, setAllBooks] = useState<BookMetadata[]>([SAMPLE_BOOK.metadata]);
  const [theme, setTheme] = useState<EditorTheme>('light');
  const [font, setFont] = useState<EditorFont>('editorial');
  const [uiLanguage, setUiLanguageState] = useState<UiLanguage>('en');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const books = listBooks();
    setAllBooks(books);

    const storedId = getStoredCurrentBookId();
    if (storedId) {
      const book = getBook(storedId);
      if (book) {
        setCurrentBook(book);
        if (book.metadata.language === 'ar') {
          setUiLanguageState('ar');
        }
        return;
      }
    }

    if (books.length > 0) {
      const firstBook = getBook(books[0].id);
      if (firstBook) {
        setCurrentBook(firstBook);
        setStoredCurrentBookId(firstBook.metadata.id);
      }
    }
  }, []);

  const isRtlLayout = uiLanguage === 'ar';
  const t = translations[uiLanguage] || translations.en;

  // Sync RTL and language to document html element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', uiLanguage);
    root.setAttribute('dir', isRtlLayout ? 'rtl' : 'ltr');
  }, [uiLanguage, isRtlLayout]);

  // Sync theme to root html/body class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-sepia', 'theme-dark', 'theme-night', 'dark');
    if (theme === 'dark' || theme === 'night') {
      root.classList.add('dark');
    }
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // Keyboard shortcut for Focus Mode (Ctrl/Cmd + Shift + F) or ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
      } else if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Debounced auto-save
  const triggerAutoSave = useCallback((bookToSave: Book) => {
    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveBook(bookToSave);
      setIsSaving(false);
      setLastSaved(new Date());
      setAllBooks(listBooks());
    }, 500);
  }, []);

  const activeChapter =
    currentBook.chapters.find((c) => c.id === currentBook.activeChapterId) ||
    currentBook.chapters[0];

  const totalStats = currentBook.chapters.reduce(
    (acc, chap) => {
      acc.words += chap.wordCount;
      acc.chars += chap.characterCount;
      acc.readingTime += Math.max(1, Math.ceil(chap.wordCount / 200));
      return acc;
    },
    { words: 0, chars: 0, readingTime: 0 }
  );

  const setUiLanguage = (lang: UiLanguage) => {
    setUiLanguageState(lang);
    if (lang === 'ar' && font !== 'arabic') {
      setFont('arabic');
    }
  };

  const setBookDirection = (dir: TextDirection) => {
    updateMetadata({ direction: dir });
  };

  const setActiveChapterId = (id: string) => {
    setCurrentBook((prev) => {
      const updated = { ...prev, activeChapterId: id };
      saveBook(updated);
      return updated;
    });
  };

  const updateChapterContent = useCallback(
    (chapterId: string, content: string) => {
      setCurrentBook((prev) => {
        const stats = countWords(content);
        const updatedChapters = prev.chapters.map((c) => {
          if (c.id === chapterId) {
            return {
              ...c,
              content,
              wordCount: stats.words,
              characterCount: stats.chars,
              lastModified: Date.now(),
            };
          }
          return c;
        });
        const updatedBook: Book = { ...prev, chapters: updatedChapters };
        triggerAutoSave(updatedBook);
        return updatedBook;
      });
    },
    [triggerAutoSave]
  );

  const updateChapterTitle = useCallback(
    (chapterId: string, title: string) => {
      setCurrentBook((prev) => {
        const updatedChapters = prev.chapters.map((c) => {
          if (c.id === chapterId) {
            return {
              ...c,
              title,
              slug: slugify(title),
              lastModified: Date.now(),
            };
          }
          return c;
        });
        const updatedBook: Book = { ...prev, chapters: updatedChapters };
        triggerAutoSave(updatedBook);
        return updatedBook;
      });
    },
    [triggerAutoSave]
  );

  const updateChapterStatus = useCallback(
    (chapterId: string, status: ChapterStatus) => {
      setCurrentBook((prev) => {
        const updatedChapters = prev.chapters.map((c) => {
          if (c.id === chapterId) {
            return {
              ...c,
              status,
              lastModified: Date.now(),
            };
          }
          return c;
        });
        const updatedBook: Book = { ...prev, chapters: updatedChapters };
        triggerAutoSave(updatedBook);
        return updatedBook;
      });
    },
    [triggerAutoSave]
  );

  const addChapter = useCallback(
    (title?: string): string => {
      const newId = generateId();
      const chapterNum = currentBook.chapters.length + 1;
      const isArabic = currentBook.metadata.language === 'ar' || uiLanguage === 'ar';
      const defaultTitle = isArabic
        ? `الفصل ${chapterNum}: فصل جديد`
        : `Chapter ${chapterNum}: Untitled Chapter`;
      const chapTitle = title || defaultTitle;

      const newChapter: Chapter = {
        id: newId,
        title: chapTitle,
        slug: slugify(chapTitle),
        content: `<h1>${chapTitle}</h1><p>${
          isArabic ? 'ابدأ في كتابة نص الفصل هنا...' : 'Begin typing your chapter here...'
        }</p>`,
        status: 'draft',
        wordCount: 7,
        characterCount: 42,
        order: currentBook.chapters.length,
        direction: currentBook.metadata.direction || (isArabic ? 'rtl' : 'ltr'),
        lastModified: Date.now(),
      };

      setCurrentBook((prev) => {
        const updatedChapters = [...prev.chapters, newChapter];
        const updatedBook: Book = {
          ...prev,
          chapters: updatedChapters,
          activeChapterId: newId,
        };
        saveBook(updatedBook);
        setAllBooks(listBooks());
        return updatedBook;
      });

      return newId;
    },
    [currentBook.chapters.length, currentBook.metadata, uiLanguage]
  );

  const duplicateChapter = useCallback((chapterId: string) => {
    setCurrentBook((prev) => {
      const target = prev.chapters.find((c) => c.id === chapterId);
      if (!target) return prev;

      const newId = generateId();
      const cloned: Chapter = {
        ...target,
        id: newId,
        title: `${target.title} (Copy)`,
        slug: slugify(`${target.title}-copy`),
        order: target.order + 0.5,
        lastModified: Date.now(),
      };

      const chapters = [...prev.chapters, cloned]
        .sort((a, b) => a.order - b.order)
        .map((c, i) => ({ ...c, order: i }));

      const updatedBook: Book = {
        ...prev,
        chapters,
        activeChapterId: newId,
      };
      saveBook(updatedBook);
      return updatedBook;
    });
  }, []);

  const deleteChapter = useCallback((chapterId: string) => {
    setCurrentBook((prev) => {
      if (prev.chapters.length <= 1) {
        alert('Your book must have at least one chapter.');
        return prev;
      }

      const filtered = prev.chapters.filter((c) => c.id !== chapterId);
      const reordered = filtered.map((c, i) => ({ ...c, order: i }));
      const newActiveId =
        prev.activeChapterId === chapterId ? reordered[0].id : prev.activeChapterId;

      const updatedBook: Book = {
        ...prev,
        chapters: reordered,
        activeChapterId: newActiveId,
      };
      saveBook(updatedBook);
      return updatedBook;
    });
  }, []);

  const reorderChapters = useCallback((startIndex: number, endIndex: number) => {
    setCurrentBook((prev) => {
      const result = Array.from(prev.chapters);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      const reordered = result.map((c, idx) => ({ ...c, order: idx }));
      const updatedBook: Book = {
        ...prev,
        chapters: reordered,
      };
      saveBook(updatedBook);
      return updatedBook;
    });
  }, []);

  const updateMetadata = useCallback(
    (meta: Partial<BookMetadata>) => {
      setCurrentBook((prev) => {
        const updatedMetadata = { ...prev.metadata, ...meta };
        const updatedBook: Book = { ...prev, metadata: updatedMetadata };
        triggerAutoSave(updatedBook);
        return updatedBook;
      });
    },
    [triggerAutoSave]
  );

  const updateCover = useCallback(
    (cover: Partial<CoverConfig>) => {
      setCurrentBook((prev) => {
        const updatedCover = { ...prev.metadata.coverConfig, ...cover };
        const updatedMetadata = { ...prev.metadata, coverConfig: updatedCover };
        const updatedBook: Book = { ...prev, metadata: updatedMetadata };
        triggerAutoSave(updatedBook);
        return updatedBook;
      });
    },
    [triggerAutoSave]
  );

  const switchBook = useCallback((bookId: string) => {
    const book = getBook(bookId);
    if (book) {
      setCurrentBook(book);
      setStoredCurrentBookId(bookId);
      if (book.metadata.language === 'ar') {
        setUiLanguageState('ar');
        setFont('arabic');
      }
    }
  }, []);

  const createNewBook = useCallback(
    (title?: string, author?: string, lang: string = 'en', dir: TextDirection = 'ltr'): string => {
      const newBookId = generateId();
      const isAr = lang === 'ar';
      const bookTitle = title || (isAr ? 'كتاب جديد بدون عنوان' : 'Untitled Masterpiece');
      const bookAuthor = author || (isAr ? 'مؤلف مجهول' : 'Anonymous Author');

      const newBook: Book = {
        metadata: {
          id: newBookId,
          title: bookTitle,
          subtitle: isAr ? 'رحلة أدبية وفكرية جديدة' : 'A New Journey Begins',
          author: bookAuthor,
          language: lang,
          direction: dir,
          description: isAr ? 'مخطوطة كتاب جديدة قيد التأليف والتطوير.' : 'An exciting new manuscript in the making.',
          genre: isAr ? 'أدب عام' : 'General Fiction',
          tags: ['New Book', 'Draft'],
          targetWordCount: 50000,
          coverConfig: {
            title: bookTitle,
            subtitle: isAr ? 'رحلة أدبية وفكرية جديدة' : 'A New Journey Begins',
            author: bookAuthor,
            template: isAr ? 'editorial' : 'minimal',
            bgColor1: isAr ? '#022c22' : '#1e293b',
            bgColor2: isAr ? '#064e3b' : '#0f172a',
            gradientType: 'linear',
            gradientAngle: 135,
            textColor: '#f8fafc',
            accentColor: '#38bdf8',
            fontFamily: isAr ? 'arabic' : 'editorial',
            pattern: 'none',
            imageFit: 'cover',
          },
        },
        chapters: [
          {
            id: generateId(),
            title: isAr ? 'الفصل الأول: البداية' : 'Chapter 1: The Beginning',
            slug: slugify(isAr ? 'chapter-1' : 'chapter-1-the-beginning'),
            content: `<h1>${isAr ? 'الفصل الأول: البداية' : 'Chapter 1: The Beginning'}</h1><p>${
              isAr ? 'ابدأ في كتابة مسودة الفصل هنا...' : 'Start drafting your story here...'
            }</p>`,
            status: 'draft',
            wordCount: 8,
            characterCount: 46,
            order: 0,
            direction: dir,
            lastModified: Date.now(),
          },
        ],
        activeChapterId: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newBook.activeChapterId = newBook.chapters[0].id;

      saveBook(newBook);
      setCurrentBook(newBook);
      setStoredCurrentBookId(newBookId);
      setAllBooks(listBooks());
  const createBookWithChapters = useCallback(
    (
      metadata: Partial<BookMetadata>,
      chapters: Array<{ title: string; content: string; status?: ChapterStatus }>
    ): string => {
      const newBookId = generateId();
      const lang = metadata.language || 'en';
      const dir: TextDirection = metadata.direction || (lang === 'ar' ? 'rtl' : 'ltr');
      const bookTitle = metadata.title || (lang === 'ar' ? 'كتاب جديد' : 'Untitled Masterpiece');
      const bookAuthor = metadata.author || (lang === 'ar' ? 'مؤلف مجهول' : 'Anonymous Author');

      const mappedChapters: Chapter[] = chapters.map((ch, idx) => {
        const textOnly = ch.content.replace(/<[^>]+>/g, ' ').trim();
        const wordCount = textOnly ? textOnly.split(/\s+/).length : 0;
        const characterCount = textOnly.length;

        return {
          id: generateId(),
          title: ch.title,
          slug: slugify(ch.title),
          content: ch.content,
          status: ch.status || 'draft',
          wordCount,
          characterCount,
          order: idx,
          direction: dir,
          lastModified: Date.now(),
        };
      });

      const newBook: Book = {
        metadata: {
          id: newBookId,
          title: bookTitle,
          subtitle: metadata.subtitle || '',
          author: bookAuthor,
          publisher: metadata.publisher || '',
          language: lang,
          direction: dir,
          description: metadata.description || '',
          genre: metadata.genre || 'General',
          tags: ['AI Generated', 'Manuscript'],
          targetWordCount: mappedChapters.reduce((acc, c) => acc + c.wordCount, 0) || 50000,
          coverConfig: {
            title: bookTitle,
            subtitle: metadata.subtitle || '',
            author: bookAuthor,
            template: lang === 'ar' ? 'editorial' : 'minimal',
            bgColor1: lang === 'ar' ? '#064e3b' : '#1e1b4b',
            bgColor2: lang === 'ar' ? '#022c22' : '#0f172a',
            gradientType: 'linear',
            gradientAngle: 135,
            textColor: '#f8fafc',
            accentColor: '#38bdf8',
            fontFamily: lang === 'ar' ? 'arabic' : 'editorial',
            pattern: 'none',
            imageFit: 'cover',
          },
        },
        chapters: mappedChapters.length > 0 ? mappedChapters : [
          {
            id: generateId(),
            title: lang === 'ar' ? 'الفصل الأول' : 'Chapter 1',
            slug: 'chapter-1',
            content: '<p></p>',
            status: 'draft',
            wordCount: 0,
            characterCount: 0,
            order: 0,
            direction: dir,
            lastModified: Date.now(),
          }
        ],
        activeChapterId: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newBook.activeChapterId = newBook.chapters[0].id;

      saveBook(newBook);
      setCurrentBook(newBook);
      setStoredCurrentBookId(newBookId);
      setAllBooks(listBooks());
      return newBookId;
    },
    []
  );

  const deleteCurrentBook = useCallback(() => {
    const books = listBooks();
    if (books.length <= 1) {
      alert('You cannot delete the only book in your library. Create another book first.');
      return;
    }

    const nextBookMeta = books.find((b) => b.id !== currentBook.metadata.id);
    deleteBookStorage(currentBook.metadata.id);
    const updatedBooks = listBooks();
    setAllBooks(updatedBooks);

    if (nextBookMeta) {
      const nextBook = getBook(nextBookMeta.id);
      if (nextBook) {
        setCurrentBook(nextBook);
        setStoredCurrentBookId(nextBook.metadata.id);
      }
    }
  }, [currentBook.metadata.id]);

  const resetToSampleBook = useCallback(() => {
    saveBook(SAMPLE_BOOK);
    setCurrentBook(SAMPLE_BOOK);
    setStoredCurrentBookId(SAMPLE_BOOK.metadata.id);
    setAllBooks(listBooks());
  }, []);

  const toggleFocusMode = (val?: boolean) => {
    setIsFocusMode((prev) => (typeof val === 'boolean' ? val : !prev));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <BookContext.Provider
      value={{
        currentBook,
        allBooks,
        activeChapter,
        theme,
        font,
        uiLanguage,
        t,
        isRtlLayout,
        isFocusMode,
        isSidebarOpen,
        isSaving,
        lastSaved,
        totalStats,
        setUiLanguage,
        setBookDirection,
        setActiveChapterId,
        updateChapterContent,
        updateChapterTitle,
        updateChapterStatus,
        addChapter,
        duplicateChapter,
        deleteChapter,
        reorderChapters,
        updateMetadata,
        updateCover,
        switchBook,
        createNewBook,
        createBookWithChapters,
        deleteCurrentBook,
        resetToSampleBook,
        setTheme,
        setFont,
        toggleFocusMode,
        toggleSidebar,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
}