export function CategoryTag({ category }: { category: "ai" | "data" }) {
  const isAi = category === "ai";
  return (
    <span
      className="category-label"
      style={{
        color: isAi ? "var(--signal-ai)" : "var(--signal-data)",
      }}
    >
      {isAi ? "AI / GenAI" : "Data Analytics"}
    </span>
  );
}
