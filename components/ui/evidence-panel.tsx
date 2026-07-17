import type { EvidenceItem } from "@/types/portfolio";

export function EvidencePanel({ title, source, items }: { title: string; source: string; items: EvidenceItem[] }) {
  return (
    <div className="evidence-panel">
      <div className="evidence-panel-head">
        <span>{title}</span>
        <small>{source}</small>
      </div>
      <div className="evidence-grid">
        {items.map((item) => (
          <article className={`evidence-item evidence-${item.status}`} key={item.label}>
            <span className="evidence-status"><span className="sr-only">Status: {item.status}</span></span>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
