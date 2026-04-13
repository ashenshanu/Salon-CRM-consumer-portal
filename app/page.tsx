import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ── Stroke-style SVG icons ─────────────────────────────────────────────────

function ScissorsIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664l-5.94-1.981" />
    </svg>
  );
}

function PaletteIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  );
}

function SparklesIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function HandIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l-.001-5.925a1.575 1.575 0 00-3.15 0" />
    </svg>
  );
}

function FaceIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  { icon: ScissorsIcon, label: "Women's Hair", desc: "Cuts, styling & blowouts" },
  { icon: ScissorsIcon, label: "Men's Grooming", desc: "Cuts & beard shaping" },
  { icon: PaletteIcon, label: 'Colour & Highlights', desc: 'Balayage, tints & toners' },
  { icon: HandIcon, label: 'Nail Care', desc: 'Gel, acrylics & nail art' },
  { icon: FaceIcon, label: 'Skin & Facials', desc: 'Deep cleanse & treatments' },
];

const SERVICES = [
  { icon: ScissorsIcon, name: "Women's Haircut & Style", desc: 'Precision cut followed by professional styling.', duration: '45m', price: 'රු 6,500' },
  { icon: PaletteIcon, name: 'Balayage & Colour', desc: 'Hand-painted highlights for a sun-kissed look.', duration: '2h', price: 'රු 12,000' },
  { icon: HandIcon, name: 'Gel Manicure', desc: 'Long-lasting gel polish with cuticle care.', duration: '1h', price: 'රු 3,500' },
  { icon: FaceIcon, name: 'Luxury Facial', desc: 'Deep cleanse and hydration treatment.', duration: '1h 30m', price: 'රු 8,000' },
];

const FAQ_ITEMS = [
  'How do I book an appointment online?',
  'Can I book for someone else?',
  'What is your cancellation policy?',
  'How do I earn loyalty points?',
];

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="flex-1">

        {/* ── Hero (seamlessly continues header gradient) ─────────────────── */}
        <section className="hero-gradient text-white pt-12 pb-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 font-headline">
              Welcome to Salon Bhagi
            </h1>
            <p className="text-xl text-white/80 mb-10 font-light tracking-wide">
              Book your next appointment online in minutes
            </p>
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search services or stylists…"
                className="w-full bg-white/20 backdrop-blur-md border-none rounded-full py-4 px-8 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2" aria-label="Search">
                <SearchIcon />
              </button>
            </div>
          </div>
        </section>

        {/* ── Service category card overlapping hero ─────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 -mt-12 relative z-10">
          <div className="grid grid-cols-5 bg-white rounded-xl shadow-xl overflow-hidden h-40">
            {SERVICE_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = i === 0;
              return (
                <Link
                  key={cat.label}
                  href="/book"
                  className={[
                    'relative flex flex-col items-center justify-center gap-3 border-r border-slate-100 last:border-r-0 transition-colors',
                    isActive ? 'bg-white' : 'bg-white opacity-50 hover:opacity-80',
                  ].join(' ')}
                >
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-tertiary" />
                  )}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isActive ? 'bg-tertiary/10' : 'bg-slate-50'}`}>
                    <Icon className={`h-6 w-6 ${isActive ? 'text-tertiary' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-center px-2">
                    <p className={`font-bold text-xs leading-tight ${isActive ? 'text-tertiary' : 'text-slate-700'}`}>
                      {cat.label}
                    </p>
                    {isActive && (
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Book Now</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Main 12-col content ────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left 8-col */}
            <div className="lg:col-span-8 space-y-10">

              {/* Services grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Our Services</h2>
                  <Link href="/book" className="text-tertiary text-xs font-bold hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <Link
                        key={svc.name}
                        href="/book"
                        className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer block"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-primary font-bold text-sm">{svc.price}</span>
                        </div>
                        <h3 className="font-bold text-base mb-1 text-on-surface">{svc.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{svc.desc}</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{svc.duration}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* FAQ / Recommendations */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Common Questions</h2>
                  <Link href="/sign-up" className="text-tertiary text-xs font-bold hover:underline">More tips</Link>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                  {FAQ_ITEMS.map((q) => (
                    <div key={q} className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer group">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">?</div>
                      <p className="text-sm font-medium flex-1 text-slate-700">{q}</p>
                      <ChevronRightIcon />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right 4-col sidebar */}
            <div className="lg:col-span-4 space-y-8">

              {/* Contact Us */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Contact Us</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-5">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Need help with a booking or have a special request?
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <PhoneIcon />
                      <span>+44 7700 000100</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <EnvelopeIcon />
                      <span>hello@salonbhagi.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <MapPinIcon />
                      <span>12 High Street, London</span>
                    </div>
                  </div>
                  <button className="w-full bg-tertiary text-white py-3 rounded-lg font-bold hover:bg-tertiary/90 transition-colors shadow-lg shadow-tertiary/20 text-sm">
                    Chat With Us
                  </button>
                </div>
              </section>

              {/* Dark booking CTA card */}
              <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Ready to book?</p>
                  <p className="text-3xl font-extrabold mb-2 font-headline">Salon Bhagi</p>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Experience premium salon services tailored just for you.
                  </p>
                  <Link
                    href="/book"
                    className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors text-sm"
                  >
                    Book an Appointment
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}
