import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display text-lg tracking-tight hover:opacity-70 transition-opacity"
        >
          Abhay Chand
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link href="/#work" className="hidden sm:inline hover:opacity-70 transition-opacity">
            Work
          </Link>
          <Link href="/#experience" className="hidden sm:inline hover:opacity-70 transition-opacity">
            Experience
          </Link>
          <Link href="/#skills" className="hidden sm:inline hover:opacity-70 transition-opacity">
            Skills
          </Link>
          <Link
            href="/#contact"
            className="rounded-full border border-ink px-4 py-1.5 hover:bg-ink hover:text-paper transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
