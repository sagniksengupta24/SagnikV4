import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";
import { IndusFlow } from "@/components/client/indus-flow";

export function ConfidentialProject() {
  return (
    <article className="project project-indus" id="private-ai-system" data-verification-state="test">
      <div className="project-frame content-wide">
        <header className="project-heading project-heading-light" data-reveal>
          <p><span>01</span> Local-first AI engineering</p>
          <h3>Indus Agent</h3>
          <div>
            <strong>An engineering agent designed to show its work.</strong>
            <p>
              A local-first runtime that combines agent routing, memory, controlled tools and verification loops—so useful automation does not require blind trust.
            </p>
          </div>
        </header>

        <div className="indus-stage" data-reveal>
          <IndusFlow />
          <div className="indus-statement" data-parallax>
            <span>Not another chat window.</span>
            <strong>A path from intention<br />to inspectable action.</strong>
          </div>
        </div>

        <div className="project-outcome project-outcome-light" data-reveal>
          <p>
            The current system includes explicit operating modes, typed tool calls, rollback-aware file changes, receipts, local model support and evidence-oriented memory. The long-term direction is an AI Engineering OS for coding, mathematics and semiconductor workflows.
          </p>
          <div>
            <span>Built with</span>
            <strong>Python · Ollama · Next.js · deterministic tools</strong>
          </div>
          <a href="mailto:sagniksengupta24@gmail.com?subject=Indus%20Agent%20walkthrough">Discuss the system <ArrowIcon /></a>
          <a href="https://github.com/sagniksengupta24" target="_blank" rel="noreferrer">Explore public work <ExternalIcon /></a>
        </div>
      </div>
    </article>
  );
}
