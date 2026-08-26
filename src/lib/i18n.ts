export type UiLanguage = 'en' | 'ar' | 'es';

export interface TranslationDict {
  appName: string;
  proBadge: string;
  tableOfContents: string;
  newChapter: string;
  searchChapters: string;
  noMatchingChapters: string;
  noChaptersYet: string;
  words: string;
  chars: string;
  readingTime: string;
  minRead: string;
  goal: string;
  completed: string;
  draft: string;
  review: string;
  complete: string;
  markAsDraft: string;
  markInReview: string;
  markAsComplete: string;
  renameChapter: string;
  duplicateChapter: string;
  deleteChapter: string;
  bookProject: string;
  coverStudio: string;
  metadata: string;
  exportBook: string;
  zenMode: string;
  exitFocus: string;
  savingChanges: string;
  allSaved: string;
  lightTheme: string;
  sepiaTheme: string;
  darkTheme: string;
  nightTheme: string;
  // Hub Tabs
  tabMetadata: string;
  tabCover: string;
  tabTypography: string;
  tabExport: string;
  studioHubTitle: string;
  studioHubSubtitle: string;
  // Metadata & Stats
  bookLibrary: string;
  createNewBook: string;
  bookTitle: string;
  subtitle: string;
  authorName: string;
  publisher: string;
  genre: string;
  language: string;
  textDirection: string;
  ltrText: string;
  rtlText: string;
  isbn: string;
  targetWordCount: string;
  synopsis: string;
  saveMetadata: string;
  cancel: string;
  close: string;
  active: string;
  switchToThis: string;
  restoreSample: string;
  deleteCurrentBook: string;
  // Stats
  bookAnalytics: string;
  writingProgress: string;
  totalWords: string;
  chaptersCount: string;
  avgPerChapter: string;
  workflowBreakdown: string;
  // Editor Tooltips & Tools
  undo: string;
  redo: string;
  heading1: string;
  heading2: string;
  heading3: string;
  bold: string;
  italic: string;
  underline: string;
  strike: string;
  code: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  bulletList: string;
  orderedList: string;
  blockquote: string;
  horizontalRule: string;
  highlightText: string;
  textColor: string;
  clearFormatting: string;
  insertTable: string;
  tableTools: string;
  addRowAbove: string;
  addRowBelow: string;
  deleteRow: string;
  addColumnBefore: string;
  addColumnAfter: string;
  deleteColumn: string;
  deleteTable: string;
  toggleRtl: string;
  // Cover Studio
  coverTitle: string;
  coverPresets: string;
  colorGradient: string;
  typography: string;
  uploadArtwork: string;
  mockup3D: string;
  flat2D: string;
  exportCoverPng: string;
  applyCover: string;
  primaryColor: string;
  secondaryColor: string;
  gradientStyle: string;
  textureOverlay: string;
  badgeLabel: string;
  browseImage: string;
  removeImage: string;
  // Exporter
  exportManuscript: string;
  selectOutputFormat: string;
  includeCoverPage: string;
  includeToc: string;
  selectChapters: string;
  selectAll: string;
  clearSelection: string;
  exportedSuccess: string;
  downloadEpub: string;
  downloadDocx: string;
  downloadPdf: string;
  downloadMarkdown: string;
  downloadText: string;
  downloadJson: string;
  openPrintable: string;
  wordDocument: string;
  wordDocDesc: string;
  epubDocDesc: string;
  pdfDocDesc: string;
  mdDocDesc: string;
  txtDocDesc: string;
  jsonDocDesc: string;
}

export const translations: Record<UiLanguage, TranslationDict> = {
  en: {
    appName: 'E-Book Studio',
    proBadge: 'ENTERPRISE',
    tableOfContents: 'Table of Contents',
    newChapter: 'Add Chapter',
    searchChapters: 'Search chapters...',
    noMatchingChapters: 'No matching chapters found',
    noChaptersYet: 'No chapters yet',
    words: 'words',
    chars: 'chars',
    readingTime: 'Reading Time',
    minRead: 'min read',
    goal: 'Goal',
    completed: 'Completed',
    draft: 'Draft',
    review: 'In Review',
    complete: 'Finished',
    markAsDraft: 'Mark as Draft',
    markInReview: 'Mark In Review',
    markAsComplete: 'Mark as Finished',
    renameChapter: 'Rename Chapter',
    duplicateChapter: 'Duplicate Chapter',
    deleteChapter: 'Delete Chapter',
    bookProject: 'Manuscript Settings',
    coverStudio: 'Cover Designer',
    metadata: 'Metadata',
    exportBook: 'Export Manuscript',
    zenMode: 'Zen Mode',
    exitFocus: 'Exit Zen Mode (ESC)',
    savingChanges: 'Saving...',
    allSaved: 'Saved to cloud',
    lightTheme: 'Light Mode',
    sepiaTheme: 'Sepia Warm',
    darkTheme: 'Zinc Dark',
    nightTheme: 'OLED Night',
    tabMetadata: 'Book Metadata',
    tabCover: 'Cover Studio',
    tabTypography: 'Typography & Layout',
    tabExport: 'Export Suite',
    studioHubTitle: 'Manuscript Studio & Publishing Hub',
    studioHubSubtitle: 'Configure book details, design 3D cover artwork, and export to Kindle, Word, or PDF.',
    bookLibrary: 'Book Library',
    createNewBook: 'Create New Manuscript',
    bookTitle: 'Book Title',
    subtitle: 'Subtitle / Tagline',
    authorName: 'Author Name',
    publisher: 'Publisher / Imprint',
    genre: 'Genre / Category',
    language: 'Content Language',
    textDirection: 'Text Direction',
    ltrText: 'Left to Right (LTR)',
    rtlText: 'Right to Left (RTL)',
    isbn: 'ISBN / Identifier',
    targetWordCount: 'Target Word Goal',
    synopsis: 'Synopsis & Blurb',
    saveMetadata: 'Save Settings',
    cancel: 'Cancel',
    close: 'Close',
    active: 'Active',
    switchToThis: 'Switch to this',
    restoreSample: 'Restore Sample Manuscript',
    deleteCurrentBook: 'Delete Manuscript',
    bookAnalytics: 'Writing Analytics & Statistics',
    writingProgress: 'Writing Progress',
    totalWords: 'Total Words',
    chaptersCount: 'Chapters',
    avgPerChapter: 'Avg / Chapter',
    workflowBreakdown: 'Chapter Pipeline Breakdown',
    undo: 'Undo (Ctrl+Z)',
    redo: 'Redo (Ctrl+Y)',
    heading1: 'Heading 1 (#)',
    heading2: 'Heading 2 (##)',
    heading3: 'Heading 3 (###)',
    bold: 'Bold (Ctrl+B)',
    italic: 'Italic (Ctrl+I)',
    underline: 'Underline (Ctrl+U)',
    strike: 'Strikethrough',
    code: 'Inline Code (` )',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignJustify: 'Justify',
    bulletList: 'Bullet List (-)',
    orderedList: 'Ordered List (1.)',
    blockquote: 'Blockquote (>)',
    horizontalRule: 'Divider (---)',
    highlightText: 'Highlight Text',
    textColor: 'Text Color',
    clearFormatting: 'Clear Formatting',
    insertTable: 'Insert Table (3x3)',
    tableTools: 'Table Options',
    addRowAbove: 'Add Row Above',
    addRowBelow: 'Add Row Below',
    deleteRow: 'Delete Row',
    addColumnBefore: 'Add Column Before',
    addColumnAfter: 'Add Column After',
    deleteColumn: 'Delete Column',
    deleteTable: 'Delete Table',
    toggleRtl: 'Switch RTL / LTR Direction',
    coverTitle: 'Book Cover Studio',
    coverPresets: 'Style Presets',
    colorGradient: 'Color & Gradient',
    typography: 'Typography',
    uploadArtwork: 'Upload Artwork',
    mockup3D: '3D Mockup',
    flat2D: '2D Flat Print',
    exportCoverPng: 'Export High-Res PNG',
    applyCover: 'Apply Cover to Book',
    primaryColor: 'Primary Color',
    secondaryColor: 'Secondary Gradient',
    gradientStyle: 'Gradient Style',
    textureOverlay: 'Texture Pattern',
    badgeLabel: 'Header Badge Label',
    browseImage: 'Browse Artwork',
    removeImage: 'Remove Artwork',
    exportManuscript: 'Export E-Book Manuscript',
    selectOutputFormat: 'Select Output Publishing Format',
    includeCoverPage: 'Include High-Res Cover Page',
    includeToc: 'Include Dynamic Table of Contents',
    selectChapters: 'Select Chapters to Export',
    selectAll: 'Select All',
    clearSelection: 'Clear',
    exportedSuccess: 'Manuscript compiled and exported successfully!',
    downloadEpub: 'Download EPUB 3.0',
    downloadDocx: 'Download Word (.docx)',
    downloadPdf: 'Open Printable PDF View',
    downloadMarkdown: 'Download Markdown (.md)',
    downloadText: 'Download Plain Text (.txt)',
    downloadJson: 'Download JSON Backup',
    openPrintable: 'Open Printable Manuscript',
    wordDocument: 'Microsoft Word (.docx)',
    wordDocDesc: 'Standard editable Word document with clean typography, tables, and cover.',
    epubDocDesc: 'Standard e-book for Apple Books, Amazon Kindle, Kobo & Google Play Books.',
    pdfDocDesc: 'Print-ready formatted manuscript with custom margins & running headers.',
    mdDocDesc: 'Clean Markdown manuscript with YAML frontmatter for GitHub & Obsidian.',
    txtDocDesc: 'Pure unformatted text for word processors and quick submissions.',
    jsonDocDesc: 'Complete workspace backup archive to restore or transfer between devices.',
  },
  ar: {
    appName: 'استوديو الكتب الرقمية',
    proBadge: 'النسخة الاحترافية',
    tableOfContents: 'جدول المحتويات',
    newChapter: 'إضافة فصل',
    searchChapters: 'بحث في الفصول...',
    noMatchingChapters: 'لم يتم العثور على فصول مطابقة',
    noChaptersYet: 'لا توجد فصول بعد',
    words: 'كلمة',
    chars: 'حرف',
    readingTime: 'وقت القراءة',
    minRead: 'دقيقة قراءة',
    goal: 'الهدف',
    completed: 'مكتمل',
    draft: 'مسودة',
    review: 'قيد المراجعة',
    complete: 'منجز',
    markAsDraft: 'تعيين كمسودة',
    markInReview: 'تعيين قيد المراجعة',
    markAsComplete: 'تعيين كمنجز',
    renameChapter: 'إعادة تسمية الفصل',
    duplicateChapter: 'تكرار الفصل',
    deleteChapter: 'حذف الفصل',
    bookProject: 'إعدادات المخطوطة',
    coverStudio: 'مصمم الغلاف',
    metadata: 'البيانات الوصفية',
    exportBook: 'تصدير الكتاب',
    zenMode: 'وضع التركيز (Zen)',
    exitFocus: 'إنهاء وضع التركيز (ESC)',
    savingChanges: 'جارٍ الحفظ...',
    allSaved: 'تم الحفظ في السحابة',
    lightTheme: 'المظهر الفاتح',
    sepiaTheme: 'ورق دافئ (Sepia)',
    darkTheme: 'داكن حديث (Zinc)',
    nightTheme: 'داكن كلي (OLED)',
    tabMetadata: 'بيانات الكتاب',
    tabCover: 'استوديو الغلاف',
    tabTypography: 'الخطوط والتنسيق',
    tabExport: 'مركز التصدير',
    studioHubTitle: 'استوديو المخطوطة ومركز النشر',
    studioHubSubtitle: 'إعداد تفاصيل الكتاب، تصميم غلاف ثلاثي الأبعاد، والتصدير إلى Kindle أو Word أو PDF.',
    bookLibrary: 'مكتبة الكتب',
    createNewBook: 'إنشاء كتاب جديد',
    bookTitle: 'عنوان الكتاب',
    subtitle: 'العنوان الفرعي',
    authorName: 'اسم المؤلف',
    publisher: 'دار النشر',
    genre: 'التصنيف / النوع',
    language: 'لغة المحتوى',
    textDirection: 'اتجاه النص',
    ltrText: 'من اليسار إلى اليمين (LTR)',
    rtlText: 'من اليمين إلى اليسار (RTL)',
    isbn: 'الرقم المعياري الدولي (ISBN)',
    targetWordCount: 'الهدف من عدد الكلمات',
    synopsis: 'ملخص ونبذة عن الكتاب',
    saveMetadata: 'حفظ الإعدادات',
    cancel: 'إلغاء',
    close: 'إغلاق',
    active: 'نشط',
    switchToThis: 'التبديل إلى هذا الكتاب',
    restoreSample: 'استعادة الكتاب التجريبي',
    deleteCurrentBook: 'حذف المخطوطة',
    bookAnalytics: 'إحصائيات الكتاب والتقدم',
    writingProgress: 'تقدم الكتابة',
    totalWords: 'إجمالي الكلمات',
    chaptersCount: 'عدد الفصول',
    avgPerChapter: 'المعدل / فصل',
    workflowBreakdown: 'توزيع حالة الفصول',
    undo: 'تراجع (Ctrl+Z)',
    redo: 'إعادة (Ctrl+Y)',
    heading1: 'عنوان رئيسي 1 (#)',
    heading2: 'عنوان فرعي 2 (##)',
    heading3: 'عنوان قسم 3 (###)',
    bold: 'عريض (Ctrl+B)',
    italic: 'مائل (Ctrl+I)',
    underline: 'مسطر (Ctrl+U)',
    strike: 'يتوسطه خط',
    code: 'رمز برمجي (` )',
    alignLeft: 'محاذاة لليسار',
    alignCenter: 'توسيط',
    alignRight: 'محاذاة لليمين',
    alignJustify: 'ضبط النص',
    bulletList: 'قائمة نقطية (-)',
    orderedList: 'قائمة رقمية (1.)',
    blockquote: 'اقتباس (>)',
    horizontalRule: 'فاصل أفقي (---)',
    highlightText: 'تمييز النص',
    textColor: 'لون النص',
    clearFormatting: 'مسح التنسيق',
    insertTable: 'إدراج جدول (3x3)',
    tableTools: 'خيارات الجدول',
    addRowAbove: 'إضافة صف لأعلى',
    addRowBelow: 'إضافة صف لأسفل',
    deleteRow: 'حذف الصف',
    addColumnBefore: 'إضافة عمود قبله',
    addColumnAfter: 'إضافة عمود بعده',
    deleteColumn: 'حذف العمود',
    deleteTable: 'حذف الجدول',
    toggleRtl: 'تبديل اتجاه الكتابة (RTL / LTR)',
    coverTitle: 'استوديو تصميم الغلاف',
    coverPresets: 'نماذج جاهزة',
    colorGradient: 'الألوان والتدرج',
    typography: 'الخطوط والأنماط',
    uploadArtwork: 'رفع صورة الغلاف',
    mockup3D: 'معاينة ثلاثية الأبعاد',
    flat2D: 'معاينة الطباعة المسطحة',
    exportCoverPng: 'تصدير صورة الغلاف PNG',
    applyCover: 'تطبيق الغلاف على الكتاب',
    primaryColor: 'اللون الأساسي',
    secondaryColor: 'اللون الثانوي للتدرج',
    gradientStyle: 'نمط التدرج',
    textureOverlay: 'زخرفة الخلفية',
    badgeLabel: 'شارة أعلى الغلاف',
    browseImage: 'استعراض الصورة',
    removeImage: 'إزالة الصورة',
    exportManuscript: 'تصدير مخطوطة الكتاب',
    selectOutputFormat: 'اختر صيغة النشر والتصدير',
    includeCoverPage: 'تضمين صفحة الغلاف المصممة',
    includeToc: 'تضمين جدول المحتويات التفاعلي',
    selectChapters: 'تحديد الفصول المراد تصديرها',
    selectAll: 'تحديد الكل',
    clearSelection: 'مسح',
    exportedSuccess: 'تم تصدير وتجميع المخطوطة بنجاح!',
    downloadEpub: 'تحميل بصيغة EPUB 3.0',
    downloadDocx: 'تحميل بصيغة Word (.docx)',
    downloadPdf: 'فتح صفحة PDF والطباعة',
    downloadMarkdown: 'تحميل بصيغة Markdown (.md)',
    downloadText: 'تحميل كنص عادي (.txt)',
    downloadJson: 'تحميل نسخة احتياطية JSON',
    openPrintable: 'فتح المخطوطة القابلة للطباعة',
    wordDocument: 'مايكروسوفت وورد (.docx)',
    wordDocDesc: 'مستند وورد قابل للتعديل ومنسق بالعناوين والجداول والغلاف.',
    epubDocDesc: 'كتاب رقمي متوافق مع Apple Books و Amazon Kindle و Kobo.',
    pdfDocDesc: 'مخطوطة جاهزة للطباعة مع فواصل الصفحات وترقيم الرأس والتذييل.',
    mdDocDesc: 'ملف ماركداون نظيف مع الترويسات لنشر المحتوى والمزامنة.',
    txtDocDesc: 'نص عادي بدون تنسيق للمحررات وبرامج معالجة النصوص.',
    jsonDocDesc: 'أرشيف كامل للمشروع لنقله إلى جهاز آخر أو استعادته.',
  },
  es: {
    appName: 'E-Book Studio',
    proBadge: 'EMPRESARIAL',
    tableOfContents: 'Índice de Contenidos',
    newChapter: 'Añadir Capítulo',
    searchChapters: 'Buscar capítulos...',
    noMatchingChapters: 'No se encontraron capítulos coincidentes',
    noChaptersYet: 'Aún no hay capítulos',
    words: 'palabras',
    chars: 'caracteres',
    readingTime: 'Tiempo de Lectura',
    minRead: 'min de lectura',
    goal: 'Objetivo',
    completed: 'Completado',
    draft: 'Borrador',
    review: 'En Revisión',
    complete: 'Terminado',
    markAsDraft: 'Marcar como Borrador',
    markInReview: 'Marcar en Revisión',
    markAsComplete: 'Marcar como Terminado',
    renameChapter: 'Renombrar Capítulo',
    duplicateChapter: 'Duplicar Capítulo',
    deleteChapter: 'Eliminar Capítulo',
    bookProject: 'Ajustes del Manuscrito',
    coverStudio: 'Diseñador de Portada',
    metadata: 'Metadatos',
    exportBook: 'Exportar Manuscrito',
    zenMode: 'Modo Zen',
    exitFocus: 'Salir del Modo Zen (ESC)',
    savingChanges: 'Guardando...',
    allSaved: 'Guardado en la nube',
    lightTheme: 'Modo Claro',
    sepiaTheme: 'Papel Sepia',
    darkTheme: 'Zinc Oscuro',
    nightTheme: 'Noche OLED',
    tabMetadata: 'Metadatos',
    tabCover: 'Estudio de Portada',
    tabTypography: 'Tipografía y Formato',
    tabExport: 'Centro de Exportación',
    studioHubTitle: 'Estudio y Centro de Publicación',
    studioHubSubtitle: 'Configura los detalles del libro, diseña portadas en 3D y exporta a Kindle, Word o PDF.',
    bookLibrary: 'Biblioteca de Libros',
    createNewBook: 'Crear Nuevo Manuscrito',
    bookTitle: 'Título del Libro',
    subtitle: 'Subtítulo / Lema',
    authorName: 'Nombre del Autor',
    publisher: 'Editorial / Sello',
    genre: 'Género / Categoría',
    language: 'Idioma del Contenido',
    textDirection: 'Dirección del Texto',
    ltrText: 'De izquierda a derecha (LTR)',
    rtlText: 'De derecha a izquierda (RTL)',
    isbn: 'ISBN / Identificador',
    targetWordCount: 'Meta de Palabras',
    synopsis: 'Sinopsis y Reseña',
    saveMetadata: 'Guardar Ajustes',
    cancel: 'Cancelar',
    close: 'Cerrar',
    active: 'Activo',
    switchToThis: 'Cambiar a este libro',
    restoreSample: 'Restaurar Manuscrito de Muestra',
    deleteCurrentBook: 'Eliminar Manuscrito',
    bookAnalytics: 'Estadísticas del Libro',
    writingProgress: 'Progreso de Escritura',
    totalWords: 'Total de Palabras',
    chaptersCount: 'Capítulos',
    avgPerChapter: 'Promedio / Capítulo',
    workflowBreakdown: 'Estado del Flujo de Capítulos',
    undo: 'Deshacer (Ctrl+Z)',
    redo: 'Rehacer (Ctrl+Y)',
    heading1: 'Título 1 (#)',
    heading2: 'Título 2 (##)',
    heading3: 'Título 3 (###)',
    bold: 'Negrita (Ctrl+B)',
    italic: 'Cursiva (Ctrl+I)',
    underline: 'Subrayado (Ctrl+U)',
    strike: 'Tachado',
    code: 'Código (` )',
    alignLeft: 'Alinear a la Izquierda',
    alignCenter: 'Centrar',
    alignRight: 'Alinear a la Derecha',
    alignJustify: 'Justificar',
    bulletList: 'Lista con Viñetas (-)',
    orderedList: 'Lista Numerada (1.)',
    blockquote: 'Cita (>)',
    horizontalRule: 'Línea Divisoria (---)',
    highlightText: 'Resaltar Texto',
    textColor: 'Color del Texto',
    clearFormatting: 'Borrar Formato',
    insertTable: 'Insertar Tabla (3x3)',
    tableTools: 'Opciones de Tabla',
    addRowAbove: 'Agregar Fila Arriba',
    addRowBelow: 'Agregar Fila Abajo',
    deleteRow: 'Eliminar Fila',
    addColumnBefore: 'Agregar Columna Antes',
    addColumnAfter: 'Agregar Columna Después',
    deleteColumn: 'Eliminar Columna',
    deleteTable: 'Eliminar Tabla',
    toggleRtl: 'Cambiar Dirección RTL / LTR',
    coverTitle: 'Estudio de Portada',
    coverPresets: 'Plantillas de Estilo',
    colorGradient: 'Color y Degradado',
    typography: 'Tipografía',
    uploadArtwork: 'Subir Imagen',
    mockup3D: 'Maqueta 3D',
    flat2D: 'Impresión Plana 2D',
    exportCoverPng: 'Exportar PNG Alta Resolución',
    applyCover: 'Aplicar Portada al Libro',
    primaryColor: 'Color Primario',
    secondaryColor: 'Color Secundario',
    gradientStyle: 'Estilo de Degradado',
    textureOverlay: 'Textura de Fondo',
    badgeLabel: 'Etiqueta Superior',
    browseImage: 'Explorar Imagen',
    removeImage: 'Eliminar Imagen',
    exportManuscript: 'Exportar Manuscrito',
    selectOutputFormat: 'Seleccionar Formato de Publicación',
    includeCoverPage: 'Incluir Portada de Alta Calidad',
    includeToc: 'Incluir Índice de Contenidos Dinámico',
    selectChapters: 'Seleccionar Capítulos a Exportar',
    selectAll: 'Seleccionar Todo',
    clearSelection: 'Limpiar',
    exportedSuccess: '¡Manuscrito compilado y exportado con éxito!',
    downloadEpub: 'Descargar EPUB 3.0',
    downloadDocx: 'Descargar Word (.docx)',
    downloadPdf: 'Abrir Vista Imprimible PDF',
    downloadMarkdown: 'Descargar Markdown (.md)',
    downloadText: 'Descargar Texto Plano (.txt)',
    downloadJson: 'Descargar Copia JSON',
    openPrintable: 'Abrir Manuscrito Imprimible',
    wordDocument: 'Microsoft Word (.docx)',
    wordDocDesc: 'Documento Word estándar y editable con tipografía limpia, tablas y portada.',
    epubDocDesc: 'Libro electrónico estándar para Apple Books, Amazon Kindle y Kobo.',
    pdfDocDesc: 'Manuscrito listo para imprimir con márgenes personalizados y encabezados.',
    mdDocDesc: 'Markdown limpio con frontmatter para publicación y sincronización.',
    txtDocDesc: 'Texto sin formato para procesadores de texto y envíos rápidos.',
    jsonDocDesc: 'Archivo completo del proyecto para transferir o restaurar.',
  },
};