import { notFound } from "next/navigation";
import { RESOURCE_UI } from "@/lib/resource-ui";
import { ResourceManager } from "@/components/admin/resource-manager";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = RESOURCE_UI[resource];

  if (!config) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-1">{config.labelPlural}</h1>
      <p className="text-slate text-sm mb-8">
        {config.singleton
          ? "This is a single, always-published section of the site."
          : "Create, edit, publish, feature, and reorder entries. Changes go live immediately."}
      </p>
      <ResourceManager resource={resource} />
    </div>
  );
}
