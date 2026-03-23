import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseProvider } from '@/components/supabase-provider';
import SmoothScrollProvider from '@/components/smooth-scroll-provider';
import Experience from '@/components/3d/Experience';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-source-code-pro',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hopeengineer.info'),
  title: {
    default: 'HopeEngineer Hub | Engineer Your Hope',
    template: '%s | HopeEngineer',
  },
  description: 'Exploring the intersection of technology, personal growth, and artificial intelligence.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HopeEngineer Hub | Engineer Your Hope',
    description: 'Exploring the intersection of technology, personal growth, and artificial intelligence.',
    url: 'https://hopeengineer.info',
    siteName: 'HopeEngineer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HopeEngineer Hub | Engineer Your Hope',
    description: 'Exploring the intersection of technology, personal growth, and artificial intelligence.',
  },
  icons: {
    icon: '/images/profile-circle.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable}`} suppressHydrationWarning>
      <body
        className={cn("font-body antialiased", "min-h-screen bg-transparent text-foreground font-sans")}
        suppressHydrationWarning
      >
        <SupabaseProvider>
          <SmoothScrollProvider>
            <Experience />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SmoothScrollProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
