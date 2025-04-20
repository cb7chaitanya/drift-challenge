'use client';

import { WalletContextProvider } from '@/components/WalletContextProvider';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from 'geist/font/sans';
import { JetBrains_Mono } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${jetbrainsMono.variable}`}>
      <body className={GeistSans.className}>
        <WalletContextProvider>{children}</WalletContextProvider>
        <Toaster />
      </body>
    </html>
  );
} 