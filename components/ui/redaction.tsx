type RedactionProps = {
  label: string;
  width?: "short" | "medium" | "long";
};

export function Redaction({ label, width = "medium" }: RedactionProps) {
  return (
    <div className="redaction-row">
      <span>{label}</span>
      <span className={`redaction-bar redaction-${width}`}><span className="sr-only">{label} intentionally withheld</span></span>
    </div>
  );
}
