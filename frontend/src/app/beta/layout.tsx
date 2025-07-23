import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Latchkey - CI/CD Pipeline Provisioning Platform',
  description: 'Join the beta waitlist for the most intuitive CI/CD pipeline provisioning platform. Provision GitHub Actions workflows in seconds, not hours.',
  keywords: ['CI/CD', 'pipeline', 'GitHub Actions', 'deployment', 'DevOps', 'automation', 'beta'],
  authors: [{ name: 'Latchkey' }],
  creator: 'Latchkey',
  publisher: 'Latchkey',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Latchkey - Join the Beta Waitlist',
    description: 'Be among the first to experience the future of CI/CD automation. Join our beta waitlist today.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latchkey - Join the Beta Waitlist',
    description: 'Be among the first to experience the future of CI/CD automation. Join our beta waitlist today.',
  },
};

export default function BetaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}