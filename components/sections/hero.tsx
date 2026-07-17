import { ArrowIcon } from "@/components/ui/icons";
import { VerificationFallback } from "@/components/client/verification-fallback";

export function Hero() {
  return (
    <section className="hero" id="home" data-verification-state="claim">
      <div className="hero-aurora" aria-hidden="true" />
      <div className="hero-grid content-wide">
        <div className="hero-copy">
          <p className="hero-name" data-reveal>Sagnik Sengupta · AI systems, software and research</p>
          <h1 data-line-reveal>
            <span>I build AI systems</span>
            <em>that earn trust.</em>
          </h1>
          <p className="hero-lede" data-reveal>
            From local-first agents to market research and simulation, I turn ambitious ideas into software that can explain its behaviour.
          </p>
          <div className="hero-actions" data-reveal>
            <a className="button button-primary" href="#work">Explore the work <ArrowIcon /></a>
            <a className="text-action" href="mailto:sagniksengupta24@gmail.com">Start a conversation</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-mobile-core"><VerificationFallback /></div>
          <div className="hero-caption"><span>Intelligence</span><i /><span>Evidence</span></div>
        </div>
      </div>
      <div className="hero-foot content-wide" aria-hidden="true">
        <span>Scroll to discover</span>
        <i />
        <span>India · 2026</span>
      </div>
    </section>
  );
}
