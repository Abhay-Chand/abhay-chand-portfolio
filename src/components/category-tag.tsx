export function CategoryTag({ category }: { category: "ai" | "data" }) {
  const isAi = category === "ai";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{
        backgroundColor: isAi ? "var(--signal-ai-tint)" : "var(--signal-data-tint)",
        color: isAi ? "var(--signal-ai)" : "var(--signal-data)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: isAi ? "var(--signal-ai)" : "var(--signal-data)" }}
        aria-hidden="true"
      />
      {isAi ? "AI / GenAI" : "Data Analytics"}
    </span>
  );
}
