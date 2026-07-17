import { ExternalIcon } from "@/components/ui/icons";
import { NiftySignalStory } from "@/components/client/nifty-signal-story";
import { resolveAsset } from "@/utils/resolve-asset";

export function NiftyResearch() {
  return (
    <article className="project project-nifty" id="nifty-research" data-verification-state="fail">
      <div className="project-frame content-wide">
        <header className="project-heading project-heading-dark" data-reveal>
          <p><span>02</span> Machine-learning research</p>
          <h3>NIFTY 50<br /><em>Research Engine</em></h3>
          <div>
            <strong>The interesting signal is the one that survives reality.</strong>
            <p>
              A time-aware research pipeline built to reject strategies that disappear under leakage checks, out-of-sample evaluation or realistic execution costs.
            </p>
          </div>
        </header>

        <div data-reveal><NiftySignalStory /></div>

        <div className="nifty-findings" data-reveal>
          <article><span>50 / 50</span><p>Constituents ingested successfully before feature work began.</p></article>
          <article><span>Walk-forward</span><p>Selection and evaluation remain separated across time.</p></article>
          <article><span>Research only</span><p>No broker integration, return guarantee or live trading claim.</p></article>
        </div>

        <div className="project-outcome project-outcome-dark" data-reveal>
          <p>
            The result is less a prediction machine than a disciplined way to disprove weak ideas early. Every stage—from features to labels, calibration and cost sensitivity—exists to make overconfidence harder.
          </p>
          <a href={resolveAsset("/evidence/nifty-execution-audit-public.txt")} target="_blank" rel="noreferrer">Read the public audit <ExternalIcon /></a>
          <a href={resolveAsset("/evidence/nifty-execution-audit-public.json")} target="_blank" rel="noreferrer">Open the machine-readable record <ExternalIcon /></a>
        </div>
      </div>
    </article>
  );
}
