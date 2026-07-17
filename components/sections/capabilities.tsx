import { capabilityGroups } from "@/data/portfolio";

export function Capabilities() {
  return (
    <section className="capabilities" id="capabilities">
      <div className="content-wide capability-layout">
        <header data-reveal>
          <p>Capabilities</p>
          <h2>One practice.<br /><em>Three connected layers.</em></h2>
          <span>I work where intelligent behaviour, rigorous evaluation and product craft meet.</span>
        </header>
        <div className="capability-rings" aria-hidden="true" data-reveal><i /><i /><i /><b /></div>
        <div className="capability-groups">
          {capabilityGroups.map((group, index) => (
            <article key={group.label} data-reveal>
              <span>0{index + 1}</span>
              <h3>{group.label}</h3>
              <p>{group.items.join(" · ")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
