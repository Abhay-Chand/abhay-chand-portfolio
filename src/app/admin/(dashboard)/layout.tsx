import Link from "next/link";
import { RESOURCE_ORDER, RESOURCE_UI } from "@/lib/resource-ui";
import { LogoutButton } from "@/components/admin/logout-button";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 sm:grid-cols-[200px_1fr]">
      <aside>
        <p className="font-mono text-xs uppercase tracking-wide text-slate mb-4">Manage</p>
        <nav className="space-y-1">
          {RESOURCE_ORDER.map((resource) => (
            <Link
              key={resource}
              href={`/admin/${resource}`}
              className="block text-sm py-1.5 hover:opacity-70 transition-opacity"
            >
              {RESOURCE_UI[resource].labelPlural}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-line space-y-2">
          <Link href="/" className="block text-sm text-slate hover:opacity-70 transition-opacity">
            View site
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
