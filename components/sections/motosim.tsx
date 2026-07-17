import { ExternalIcon } from "@/components/ui/icons";
import { MotoSimReplay } from "@/components/client/motosim-replay";

export function MotoSim() {
  return (
    <article className="project project-moto" id="motosim" data-verification-state="evidence">
      <div className="project-frame content-wide">
        <header className="project-heading project-heading-moto" data-reveal>
          <p><span>03</span> Reinforcement learning</p>
          <h3>Recurrent PPO<br /><em>MotoSim</em></h3>
          <div>
            <strong>A machine learns that every push has a memory.</strong>
            <p>
              A recurrent policy climbs a stochastic mountain while balancing progress, gear selection, engine temperature and delayed mechanical cost.
            </p>
          </div>
        </header>

        <div data-reveal><MotoSimReplay /></div>

        <div className="moto-idea" data-reveal>
          <p>Most environments reward the next move.</p>
          <strong>This one asks the policy to remember what the last move did to the machine.</strong>
        </div>

        <div className="project-outcome project-outcome-moto" data-reveal>
          <div><span>Reported mean reward</span><strong>5,823</strong></div>
          <div><span>Reported finish rate</span><strong>100%</strong></div>
          <p>The replay above is a source-derived heuristic baseline, not trained-policy footage. Public benchmark details remain bounded to what the repository documents.</p>
          <a href="https://github.com/sagniksengupta24/Recurrent-PPO-MotoSim" target="_blank" rel="noreferrer">Inspect the repository <ExternalIcon /></a>
          <a href="/evidence/motosim-readme-benchmark.txt" target="_blank" rel="noreferrer">Read benchmark provenance <ExternalIcon /></a>
        </div>
      </div>
    </article>
  );
}
