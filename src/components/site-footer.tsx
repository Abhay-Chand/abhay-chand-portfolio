export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-slate">
        <p>© {new Date().getFullYear()} Abhay Chand. Built and maintained by me.</p>
        <p className="font-mono text-xs">Noida, India</p>
      </div>
    </footer>
  );
}
