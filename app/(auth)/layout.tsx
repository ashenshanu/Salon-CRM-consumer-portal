import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-stone-50">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold text-stone-900 tracking-tight">
          Ashen Salon
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
