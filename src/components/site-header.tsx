import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="section-wrap site-header-inner">
        <Link
          href="/"
          className="brand-mark"
        >
          <span>Abhay Chand</span>
        </Link>
        <nav aria-label="Primary" className="site-nav">
          <Link href="/#work" className="nav-link">
            Work
          </Link>
          <Link href="/#experience" className="nav-link nav-wide">
            Experience
          </Link>
          <Link href="/#skills" className="nav-link nav-wide">
            Skills
          </Link>
          <ThemeToggle />
          <Link
            href="/#contact"
            className="nav-contact"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
