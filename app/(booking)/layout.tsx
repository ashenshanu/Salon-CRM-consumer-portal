import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
