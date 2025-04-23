import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { Sidebar } from '@/shared/ui/sidebar';
import { ThemeProvider } from '@/shared/ui/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CLIWANT',
  description: '입찰 공고 검색 및 관리 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-screen bg-gray-50">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
