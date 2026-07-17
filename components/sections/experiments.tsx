import { experiments } from "@/data/portfolio";
import { ExternalIcon } from "@/components/ui/icons";

export function Experiments() {
  return (
    <section className="experiments" id="experiments">
      <div className="content-wide">
        <header className="experiments-head" data-reveal>
          <p>Selected experiments</p>
          <h2>Smaller builds.<br /><em>Sharp questions.</em></h2>
        </header>
        <div className="experiment-list">
          {experiments.map((experiment, index) => {
            const content = (
              <>
                <div className={`experiment-art experiment-${experiment.visual}`} aria-hidden="true"><i /><i /><i /><b>{experiment.index}</b></div>
                <div className="experiment-copy">
                  <span>{experiment.meta}</span>
                  <h3>{experiment.title}</h3>
                  <p>{experiment.description}</p>
                  <small>{experiment.tech}</small>
                </div>
                <div className="experiment-status"><span>{experiment.status}</span>{experiment.href ? <ExternalIcon /> : null}</div>
              </>
            );
            return experiment.href ? (
              <a className="experiment-row" key={experiment.title} href={experiment.href} target="_blank" rel="noreferrer" data-reveal data-order={index % 2}>{content}</a>
            ) : <article className="experiment-row" key={experiment.title} data-reveal data-order={index % 2}>{content}</article>;
          })}
        </div>
      </div>
    </section>
  );
}
