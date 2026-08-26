import { Book, BookMetadata } from '@/types/book';
import { SAMPLE_BOOK } from './sampleData';

const STORAGE_KEY_PREFIX = 'ebook_studio_';
const BOOKS_INDEX_KEY = 'ebook_studio_books_index';
const CURRENT_BOOK_ID_KEY = 'ebook_studio_current_book_id';

export function getStoredCurrentBookId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_BOOK_ID_KEY);
}

export function setStoredCurrentBookId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_BOOK_ID_KEY, id);
}

export function listBooks(): BookMetadata[] {
  if (typeof window === 'undefined') return [SAMPLE_BOOK.metadata];
  try {
    const raw = localStorage.getItem(BOOKS_INDEX_KEY);
    if (!raw) {
      saveBook(SAMPLE_BOOK);
      return [SAMPLE_BOOK.metadata];
    }
    const index: BookMetadata[] = JSON.parse(raw);
    return index.length > 0 ? index : [SAMPLE_BOOK.metadata];
  } catch (err) {
    console.error('Error listing books:', err);
    return [SAMPLE_BOOK.metadata];
  }
}

export function getBook(id: string): Book | null {
  if (typeof window === 'undefined') return SAMPLE_BOOK;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (!raw) {
      if (id === SAMPLE_BOOK.metadata.id) {
        saveBook(SAMPLE_BOOK);
        return SAMPLE_BOOK;
      }
      return null;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading book ' + id, err);
    return null;
  }
}

export function saveBook(book: Book): void {
  if (typeof window === 'undefined') return;
  try {
    const updatedBook = {
      ...book,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_PREFIX + book.metadata.id, JSON.stringify(updatedBook));

    const indexRaw = localStorage.getItem(BOOKS_INDEX_KEY);
    let index: BookMetadata[] = indexRaw ? JSON.parse(indexRaw) : [];
    const existingIdx = index.findIndex(b => b.id === book.metadata.id);
    if (existingIdx >= 0) {
      index[existingIdx] = updatedBook.metadata;
    } else {
      index.push(updatedBook.metadata);
    }
    localStorage.setItem(BOOKS_INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error('Error saving book:', err);
  }
}

export function deleteBook(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + id);
    const indexRaw = localStorage.getItem(BOOKS_INDEX_KEY);
    if (indexRaw) {
      const index: BookMetadata[] = JSON.parse(indexRaw);
      const filtered = index.filter(b => b.id !== id);
      localStorage.setItem(BOOKS_INDEX_KEY, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Error deleting book:', err);
  }
}

export function exportBackupData(): string {
  if (typeof window === 'undefined') return '';
  const books = listBooks().map(meta => getBook(meta.id)).filter(Boolean);
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    books
  }, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data && Array.isArray(data.books)) {
      data.books.forEach((b: Book) => {
        if (b && b.metadata && b.chapters) {
          saveBook(b);
        }
      });
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to parse backup JSON:', err);
    return false;
  }
}