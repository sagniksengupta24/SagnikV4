"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const stages = [
  { title: "Goal", detail: "A human defines the outcome and the limits." },
  { title: "Plan", detail: "Specialists break the problem into inspectable steps." },
  { title: "Act", detail: "Tools operate inside explicit safety modes." },
  { title: "Verify", detail: "Deterministic checks challenge the proposed result." },
  { title: "Remember", detail: "Evidence and context become reusable project memory." },
] as const;

export function IndusFlow() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % stages.length), 1800);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className="indus-flow">
      <div className="indus-orbit" aria-hidden="true">
        <i className="indus-orbit-line" />
        <i className="indus-pulse" style={{ "--stage": active } as CSSProperties} />
      </div>
      <ol aria-label="Indus Agent reasoning flow">
        {stages.map((stage, index) => (
          <li key={stage.title} data-active={active === index}>
            <button type="button" onClick={() => setActive(index)} aria-pressed={active === index}>
              <span>{stage.title}</span>
              <small>{stage.detail}</small>
            </button>
          </li>
        ))}
      </ol>
      <div className="indus-proof" aria-live="polite">
        <span>Current focus</span>
        <strong>{stages[active].title}</strong>
        <p>{stages[active].detail}</p>
      </div>
    </div>
  );
}
