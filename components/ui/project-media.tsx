import type { ReactNode } from "react";

type ProjectMediaProps = {
  label: string;
  source: string;
  children: ReactNode;
  pending?: boolean;
};

export function ProjectMedia({ label, source, children, pending = false }: ProjectMediaProps) {
  return (
    <figure className={`project-media${pending ? " project-media-pending" : ""}`}>
      <figcaption>
        <span>{label}</span>
        <small>{source}</small>
      </figcaption>
      <div className="project-media-body">{children}</div>
    </figure>
  );
}
