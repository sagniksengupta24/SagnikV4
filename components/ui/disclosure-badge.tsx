type DisclosureBadgeProps = {
  children: React.ReactNode;
  tone?: "green" | "blue" | "amber" | "neutral";
};

export function DisclosureBadge({ children, tone = "neutral" }: DisclosureBadgeProps) {
  return <span className={`disclosure-badge disclosure-${tone}`}>{children}</span>;
}
