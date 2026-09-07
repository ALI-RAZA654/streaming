import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SEKKAIICHI - 世界一 Anime Streaming Platform',
  description:
    'Discover, stream, and track your favorite anime series with high definition playback, sleek dark mode aesthetics, and community features.',
  keywords: ['anime', 'streaming', 'watch anime online', 'sekkaiichi', 'hd anime'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
