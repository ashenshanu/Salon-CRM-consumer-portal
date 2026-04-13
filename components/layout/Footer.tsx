export default function Footer() {
  return (
    <footer className="w-full py-10 bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-5">
        <div className="flex gap-10 text-sm font-semibold text-slate-400">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
        <p className="text-slate-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} Salon Bhagi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
