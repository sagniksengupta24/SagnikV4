"use client";

import { useState } from "react";

const views = [
  {
    title: "Raw market data",
    note: "Thousands of observations look persuasive before time and leakage constraints are applied.",
    progress: 18,
  },
  {
    title: "Walk-forward testing",
    note: "The model only earns confidence on future periods it did not train on.",
    progress: 58,
  },
  {
    title: "Execution reality",
    note: "A signal survives only after transaction costs, capacity and thresholds are introduced.",
    progress: 100,
  },
] as const;

export function NiftySignalStory() {
  const [active, setActive] = useState(2);
  const view = views[active];

  return (
    <div className="signal-story">
      <div className="signal-visual" role="img" aria-label={`${view.title}. ${view.note}`}>
        <svg viewBox="0 0 1000 620" aria-hidden="true">
          <defs>
            <linearGradient id="signal-glow" x1="0" x2="1">
              <stop offset="0" stopColor="#bc493d" stopOpacity="0" />
              <stop offset=".5" stopColor="#bc493d" />
              <stop offset="1" stopColor="#101114" />
            </linearGradient>
            <filter id="soft-glow"><feGaussianBlur stdDeviation="9" /></filter>
          </defs>
          <g className="noise-lines" opacity={active === 0 ? 1 : active === 1 ? .58 : .22}>
            <path d="M0 420 C80 160 120 520 210 250 S360 510 450 180 S600 540 720 240 S850 410 1000 110" />
            <path d="M0 250 C110 500 190 130 310 430 S520 150 620 390 S800 190 1000 460" />
            <path d="M0 510 C150 280 250 560 390 310 S630 520 760 250 S900 300 1000 190" />
            <path d="M0 155 C160 360 300 90 430 280 S650 120 800 320 S930 230 1000 290" />
          </g>
          <path className="signal-glow" d="M0 455 C120 430 190 470 290 410 S480 370 570 290 S720 255 810 175 S920 140 1000 95" filter="url(#soft-glow)" />
          <path className="signal-line" pathLength="100" style={{ strokeDasharray: `${view.progress} ${100 - view.progress}` }} d="M0 455 C120 430 190 470 290 410 S480 370 570 290 S720 255 810 175 S920 140 1000 95" />
          <line className="cost-line" x1="0" y1="360" x2="1000" y2="360" />
          <circle className="signal-point" cx={active === 0 ? 180 : active === 1 ? 570 : 885} cy={active === 0 ? 445 : active === 1 ? 290 : 150} r="8" />
        </svg>
        <div className="signal-cost"><span>Break-even friction</span><strong>≈3.98 bps</strong><small>per side</small></div>
        <div className="signal-caption"><span>{view.title}</span><p>{view.note}</p></div>
      </div>
      <div className="signal-controls" role="tablist" aria-label="NIFTY research story">
        {views.map((item, index) => (
          <button key={item.title} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}>
            <span>0{index + 1}</span>{item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
