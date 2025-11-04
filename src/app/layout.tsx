import type { Metadata } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-headline',
});

const fontBody = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'CuraLink',
  description: 'Connecting Patients & Researchers for a healthier tomorrow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontHeadline.variable} ${fontBody.variable} font-body antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
