import { ArrowIcon, ExternalIcon } from "@/components/ui/icons";

export function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="content-wide contact-layout">
        <p data-reveal>Have a problem worth engineering?</p>
        <h2 data-line-reveal>Let&apos;s build the part<br /><em>that cannot be faked.</em></h2>
        <a className="contact-main" href="mailto:sagniksengupta24@gmail.com" data-reveal>Start a conversation <ArrowIcon /></a>
        <div className="contact-foot">
          <span>Sagnik Sengupta · India · 2026</span>
          <nav aria-label="Social links">
            <a href="https://github.com/sagniksengupta24" target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>
            <a href="https://www.linkedin.com/in/sagnik-sengupta-3286681b6/" target="_blank" rel="noreferrer">LinkedIn <ExternalIcon /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
