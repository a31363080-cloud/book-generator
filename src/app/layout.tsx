import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Book Studio - Modern Distraction-Free Writing & Publishing Workspace',
  description:
    'Enterprise-grade e-book creation workspace supporting internationalization (English, Arabic with RTL, Spanish), TipTap tables, 3D cover generator, and multi-format exports (EPUB, DOCX, PDF).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="notranslate" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans transition-colors duration-200 selection:bg-sky-500/20">
        {children}
      </body>
    </html>
  );
}