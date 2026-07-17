import type { SVGProps } from "react";

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function ExternalIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path d="M7 17 17 7M8 7h9v9" /></svg>;
}
