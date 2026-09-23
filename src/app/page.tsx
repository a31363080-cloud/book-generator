'use client';

import React, { useState } from 'react';
import { BookProvider } from '../context/BookContext';
import { TopNav } from '../components/workspace/TopNav';
import { Sidebar } from '../components/workspace/Sidebar';
import { RichEditor } from '../components/editor/RichEditor';
import { CoverStudioModal } from '../components/cover/CoverStudioModal';
import { MetadataModal } from '../components/workspace/MetadataModal';
import { BookStatsModal } from '../components/workspace/BookStatsModal';
import { BookSelectorModal } from '../components/workspace/BookSelectorModal';
import { ExportModal } from '../components/export/ExportModal';
import { AIBookWizardModal } from '../components/workspace/AIBookWizardModal';

// Root page — no mounting guards, no loading screens.
// The BookProvider initializes state from defaults; localStorage sync
// happens inside useEffect without blocking the initial render.
export default function WorkspacePage() {
  return (
    <BookProvider>
      <WorkspaceLayout />
    </BookProvider>
  );
}

function WorkspaceLayout() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCoverStudioOpen, setIsCoverStudioOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isAIWizardOpen, setIsAIWizardOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Top Application Navigation */}
      <TopNav
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCoverStudio={() => setIsCoverStudioOpen(true)}
        onOpenBookSelector={() => setIsBookSelectorOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenAIWizard={() => setIsAIWizardOpen(true)}
      />

      {/* Main Workspace: Sidebar + Rich Editor */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar
          onOpenMetadata={() => setIsMetadataOpen(true)}
          onOpenCoverStudio={() => setIsCoverStudioOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
        />
        <RichEditor />
      </main>

      {/* Modals */}
      <CoverStudioModal isOpen={isCoverStudioOpen} onClose={() => setIsCoverStudioOpen(false)} />
      <MetadataModal isOpen={isMetadataOpen} onClose={() => setIsMetadataOpen(false)} />
      <BookStatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      <BookSelectorModal isOpen={isBookSelectorOpen} onClose={() => setIsBookSelectorOpen(false)} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <AIBookWizardModal isOpen={isAIWizardOpen} onClose={() => setIsAIWizardOpen(false)} />
    </div>
  );
}