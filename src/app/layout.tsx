import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

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
  description: 'Provision CI/CD pipelines for your GitHub projects instantly. Secure, fast, and built for modern development teams.',
  keywords: ['CI/CD', 'pipeline', 'GitHub Actions', 'deployment', 'DevOps', 'automation'],
  authors: [{ name: 'Latchkey' }],
  creator: 'Latchkey',
  publisher: 'Latchkey',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Latchkey - CI/CD Pipeline Provisioning Platform',
    description: 'Provision CI/CD pipelines for your GitHub projects instantly. Secure, fast, and built for modern development teams.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latchkey - CI/CD Pipeline Provisioning Platform',
    description: 'Provision CI/CD pipelines for your GitHub projects instantly. Secure, fast, and built for modern development teams.',
  },
};

export default function RootLayout({
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
