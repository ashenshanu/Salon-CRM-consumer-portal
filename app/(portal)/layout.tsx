import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
