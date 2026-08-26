'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useBook } from '@/context/BookContext';
import { ChapterItem } from './ChapterItem';
import { Plus, Search, Layers, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function ChapterList() {
  const {
    currentBook,
    setActiveChapterId,
    updateChapterTitle,
    updateChapterStatus,
    duplicateChapter,
    deleteChapter,
    reorderChapters,
    addChapter,
    t,
  } = useBook();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDndReady, setIsDndReady] = useState(false);

  useEffect(() => {
    setIsDndReady(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    reorderChapters(result.source.index, result.destination.index);
  };

  const filteredChapters = currentBook.chapters.filter((ch) =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header & Prominent Add Button */}
      <div className="p-3 pb-2 space-y-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.tableOfContents}</span>
            <span className="ms-1 text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold">
              {currentBook.chapters.length}
            </span>
          </div>

          <Button
            size="xs"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => addChapter()}
            className="rounded-xl shadow-sm"
          >
            {t.newChapter}
          </Button>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute start-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={t.searchChapters}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-8 pe-7 py-1.5 text-xs bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Draggable Chapters List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChapters.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-400 space-y-2">
            <p>{searchQuery ? t.noMatchingChapters : t.noChaptersYet}</p>
            {!searchQuery && (
              <Button
                size="xs"
                variant="outline"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => addChapter()}
              >
                {t.newChapter}
              </Button>
            )}
          </div>
        ) : searchQuery || !isDndReady ? (
          filteredChapters.map((chapter, index) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              index={index}
              isActive={chapter.id === currentBook.activeChapterId}
              onSelect={() => setActiveChapterId(chapter.id)}
              onUpdateTitle={(title) => updateChapterTitle(chapter.id, title)}
              onUpdateStatus={(status) => updateChapterStatus(chapter.id, status)}
              onDuplicate={() => duplicateChapter(chapter.id)}
              onDelete={() => deleteChapter(chapter.id)}
            />
          ))
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="chapters-list">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-1"
                >
                  {currentBook.chapters.map((chapter, index) => (
                    <Draggable
                      key={chapter.id}
                      draggableId={chapter.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'opacity-95 shadow-xl scale-[1.02] z-50' : ''}
                        >
                          <ChapterItem
                            chapter={chapter}
                            index={index}
                            isActive={chapter.id === currentBook.activeChapterId}
                            onSelect={() => setActiveChapterId(chapter.id)}
                            onUpdateTitle={(title) =>
                              updateChapterTitle(chapter.id, title)
                            }
                            onUpdateStatus={(status) =>
                              updateChapterStatus(chapter.id, status)
                            }
                            onDuplicate={() => duplicateChapter(chapter.id)}
                            onDelete={() => deleteChapter(chapter.id)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}