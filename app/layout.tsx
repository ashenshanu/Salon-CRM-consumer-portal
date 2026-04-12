import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import ApolloClientProvider from '@/components/providers/ApolloProvider';
import { ToastProvider } from '@/components/ui/Toast';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: { default: 'Ashen Salon', template: '%s | Ashen Salon' },
  description: 'Book your next salon appointment online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <ApolloClientProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
