import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import './globals.css';
import ApolloClientProvider from '@/components/providers/ApolloProvider';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Salon Bhagi', template: '%s | Salon Bhagi' },
  description: 'Book your next salon appointment online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f0f4f8] text-on-surface">
        <ApolloClientProvider>
          <ToastProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ToastProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
