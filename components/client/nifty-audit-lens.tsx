"use client";

import { type KeyboardEvent, useId, useState } from "react";

const tabs = [
  { id: "method", label: "Method" },
  { id: "execution", label: "Execution audit" },
  { id: "boundary", label: "Claim boundary" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const stages = [
  ["01", "Ingest", "50 constituents validated before feature work."],
  ["02", "Label", "Triple-barrier outcomes with time-aware handling."],
  ["03", "Diagnose", "Calibration, drift and feature stability checks."],
  ["04", "Validate", "Walk-forward model selection; out-of-sample research only."],
  ["05", "Stress", "Threshold, capacity and transaction-cost sensitivity."],
] as const;

export function NiftyAuditLens() {
  const [active, setActive] = useState<TabId>("method");
  const baseId = useId();

  const moveTabFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.findIndex((tab) => tab.id === active);
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    const nextId = tabs[next].id;
    setActive(nextId);
    window.requestAnimationFrame(() => document.getElementById(`${baseId}-${nextId}-tab`)?.focus());
  };

  return (
    <div className="audit-lens">
      <div className="audit-tabs" role="tablist" aria-label="NIFTY research evidence views" onKeyDown={moveTabFocus}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${baseId}-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-${tab.id}-panel`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            data-cursor="INSPECT"
          >
            <span>{String(tabs.indexOf(tab) + 1).padStart(2, "0")}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="audit-stage" aria-live="polite">
        {active === "method" ? (
          <section id={`${baseId}-method-panel`} role="tabpanel" aria-labelledby={`${baseId}-method-tab`}>
            <header className="audit-stage-head">
              <span>FALSIFIABLE PIPELINE</span>
              <strong>Signal quality is tested after time, leakage and cost constraints.</strong>
            </header>
            <ol className="audit-method-list">
              {stages.map(([index, title, copy]) => (
                <li key={index}><span>{index}</span><strong>{title}</strong><p>{copy}</p></li>
              ))}
            </ol>
          </section>
        ) : null}

        {active === "execution" ? (
          <section id={`${baseId}-execution-panel`} role="tabpanel" aria-labelledby={`${baseId}-execution-tab`}>
            <header className="audit-stage-head audit-stage-blue">
              <span>PUBLIC EXECUTION EXTRACT / STEP 5B</span>
              <strong>Costs are treated as a rejection test—not a footnote.</strong>
            </header>
            <div className="execution-audit-grid">
              <div className="execution-ruler" aria-label="Break-even execution friction approximately 3.98 basis points per side on a zero to ten basis point scale">
                <div className="ruler-copy"><span>0 BPS</span><span>10 BPS / SIDE</span></div>
                <div className="ruler-track"><i style={{ left: "39.8%" }} /><b style={{ width: "39.8%" }} /></div>
                <div className="ruler-marker" style={{ left: "39.8%" }}><strong>≈3.98</strong><span>break-even bps / side</span></div>
              </div>
              <dl className="execution-facts">
                <div><dt>Policy gate</dt><dd>Probability ≥ 0.30</dd></div>
                <div><dt>Capacity rule</dt><dd>Maximum 10 positions</dd></div>
                <div><dt>Evaluation</dt><dd>Out-of-sample only</dd></div>
                <div><dt>Evidence status</dt><dd>Owner-published audit extract</dd></div>
              </dl>
            </div>
            <p className="audit-provenance">Public extract from the project&apos;s internal execution audit. The underlying dataset and return series are not bundled, so this is documented evidence—not independently reproducible proof.</p>
          </section>
        ) : null}

        {active === "boundary" ? (
          <section id={`${baseId}-boundary-panel`} role="tabpanel" aria-labelledby={`${baseId}-boundary-tab`}>
            <header className="audit-stage-head audit-stage-amber">
              <span>CLAIM BOUNDARY</span>
              <strong>Research evidence is not a promise of tradable performance.</strong>
            </header>
            <div className="boundary-grid">
              <article><span>NOT CLAIMED</span><strong>Live performance</strong><p>No broker connection, paper account or live execution is presented.</p></article>
              <article><span>NOT CLAIMED</span><strong>Guaranteed returns</strong><p>Historical model behavior does not establish future profitability.</p></article>
              <article><span>DISCLOSED</span><strong>Assumption sensitivity</strong><p>Thresholds, capacity and transaction costs materially change conclusions.</p></article>
              <article><span>DISCLOSED</span><strong>Research status</strong><p>The system remains an experimental evaluation pipeline.</p></article>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
