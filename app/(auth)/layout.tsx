import Link from 'next/link';

function ScissorsIcon() {
  return (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664l-5.94-1.981" />
    </svg>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Top-left teal wash */}
        <div
          className="absolute top-0 left-0 w-full h-1/3 opacity-10"
          style={{ background: 'linear-gradient(135deg, #006565 0%, #008080 100%)' }}
        />
        {/* Top-right blurred orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-25 bg-primary-light" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 right-0 w-full h-1/4 bg-linear-to-t from-primary/5 to-transparent" />
      </div>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-xl shadow-[0_12px_40px_rgba(25,28,29,0.06)] overflow-hidden">
            <div className="px-10 pt-10 pb-2">

              {/* Brand identity */}
              <div className="flex flex-col items-center mb-10">
                <Link
                  href="/"
                  className="flex items-center gap-3 mb-6 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ScissorsIcon />
                  </div>
                  <span className="text-2xl font-extrabold font-headline text-primary tracking-tight">
                    Salon Bhagi
                  </span>
                </Link>
              </div>

            </div>

            {/* Page content */}
            <div className="px-10 pb-10">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 bg-white py-7 px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Salon Bhagi. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
