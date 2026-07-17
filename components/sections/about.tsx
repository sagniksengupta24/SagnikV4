export function About() {
  return (
    <section className="about" id="about">
      <div className="content-wide about-layout">
        <p className="about-label" data-reveal>About</p>
        <div className="about-copy">
          <h2 data-line-reveal>Technical depth.<br /><em>Human judgement.</em></h2>
          <div data-reveal>
            <p>
              I&apos;m an IIT Madras BS Data Science student from West Bengal, building toward a career in AI systems engineering. I care about the difficult middle ground between an impressive prototype and a system people can actually rely on.
            </p>
            <p>
              My work moves across agents, research pipelines, simulation, full-stack products and expressive web experiences. The medium changes; the standard does not: make the behaviour clear, test the claim and craft the experience with intention.
            </p>
          </div>
        </div>
        <div className="about-aside" data-reveal>
          <span>Currently exploring</span>
          <strong>Hierarchical agents · deterministic verification · engineering memory · formal workflows</strong>
          <span>Open to</span>
          <strong>Internships · research collaborations · ambitious product work</strong>
        </div>
      </div>
    </section>
  );
}
