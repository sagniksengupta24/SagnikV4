const steps = [
  ["Frame the real question", "Define the outcome, the boundary and what evidence would change the decision."],
  ["Build the smallest honest system", "Make the central behaviour tangible before polishing the surrounding product."],
  ["Pressure the assumption", "Use evaluation, simulation and deterministic tools to expose the convenient answer."],
  ["Leave the evidence visible", "Ship with limits, provenance and the next unanswered question still in view."],
] as const;

export function Method() {
  return (
    <section className="method" id="method" data-verification-state="ship">
      <div className="content-wide method-layout">
        <header data-reveal>
          <p>How I work</p>
          <h2>Ambition,<br /><em>without theatre.</em></h2>
          <span>The goal is not to make a system look intelligent. It is to make its intelligence useful, inspectable and responsible.</span>
        </header>
        <ol className="method-steps">
          {steps.map(([title, body], index) => (
            <li key={title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
