const fs = require('fs');

const part1 = `'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useBook } from '@/context/BookContext';
import {
  CoverConfig,
  CoverPattern,
  CoverTemplate,
  EditorFont,
  ExportFormat,
  TextDirection,
} from '@/types/book';
import { exportAsEpub } from '@/lib/epubGenerator';
import { exportAsDocx } from '@/lib/docxExporter';
import { exportAsMarkdown, exportAsPlainText } from '@/lib/markdownExporter';
import { exportBackupData } from '@/lib/storage';
import { CoverCanvas } from '../cover/CoverCanvas';
import { BookMockup3D } from '../cover/BookMockup3D';
import { Button } from '../ui/Button';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Sparkles,
  Download,
  Printer,
  FileText,
  FileSpreadsheet,
  FileCode,
  Archive,
  CheckCircle2,
  CheckSquare,
  Square,
  ExternalLink,
  Check,
  Layout,
  Palette,
  Type,
  ImageIcon,
  Upload,
  Settings,
} from 'lucide-react';
import { saveAs } from 'file-saver';

export type StudioHubTab = 'metadata' | 'cover' | 'typography' | 'export';

interface StudioHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: StudioHubTab;
}
`;
fs.appendFileSync('scripts/build_hub.js', part1);