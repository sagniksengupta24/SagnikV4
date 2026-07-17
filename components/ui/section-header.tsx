type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: string;
  body?: string;
  align?: "split" | "stack";
};

export function SectionHeader({ index, eyebrow, title, body, align = "split" }: SectionHeaderProps) {
  return (
    <header className={`section-header section-header-${align}`}>
      <div>
        <span className="section-index">{index}</span>
        <span className="section-eyebrow">{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </header>
  );
}
