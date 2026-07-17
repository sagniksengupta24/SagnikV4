export function Manifesto() {
  return (
    <section className="manifesto" id="philosophy" data-verification-state="decompose">
      <div className="content-wide manifesto-layout">
        <p className="manifesto-eyebrow" data-reveal>My working belief</p>
        <div className="manifesto-copy">
          <p data-line-reveal>Intelligence is easy to perform.</p>
          <p className="manifesto-serif" data-line-reveal>Trust is harder to engineer.</p>
          <div className="manifesto-note" data-reveal>
            <span>So I build around the moment a confident answer meets a difficult test.</span>
            <div className="manifesto-sequence" aria-label="Idea, pressure, evidence, release">
              <b>Idea</b><i /><b>Pressure</b><i /><b>Evidence</b><i /><b>Release</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
