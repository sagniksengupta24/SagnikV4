import type { SVGProps } from "react";

type BrandMarkProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export function BrandMark({ title = "Sagnik Sengupta identity mark", ...props }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title} {...props}>
      <path className="mark-loop" d="M49.5 17.5A23 23 0 1 0 51 44" />
      <path className="mark-s" d="M45 20.5c-3.8-3.6-9-5.5-14.2-4.9-6 .6-10.3 4.2-10.3 8.6 0 5.1 5 7 11.6 8.3 6.8 1.3 11.4 3.2 11.4 8.4 0 4.9-5.1 8.8-11.8 8.8-6 0-11.3-2.2-15.2-6.4" />
      <path className="mark-check" d="m39.5 43.5 4.7 4.8 10.3-12" />
      <circle className="mark-node" cx="49.5" cy="17.5" r="2.8" />
      <circle className="mark-node" cx="51" cy="44" r="2.8" />
    </svg>
  );
}
