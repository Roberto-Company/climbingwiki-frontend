type Props = {
  score: number;
  size?: "sm" | "md";
};

export function StarDisplay({ score, size = "sm" }: Props) {
  const sizeClass = size === "sm" ? "text-sm" : "text-lg";
  const fills = Array.from({ length: 5 }, (_, i) => Math.min(Math.max(score - i, 0), 1));

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-sans ${sizeClass} text-ochre-600`}
      aria-label={`${score} out of 5 stars`}
    >
      {fills.map((fill, i) => (
        <span key={i} className="relative inline-block leading-none" aria-hidden>
          <span className="text-stone/30">☆</span>
          {fill > 0 && (
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
