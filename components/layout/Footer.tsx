export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
        <p>&copy; {new Date().getFullYear()} Ashen Salon. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-stone-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-stone-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-stone-600 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
