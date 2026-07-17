import { Navigation } from "@/components/client/navigation";
import { SiteExperience } from "@/components/client/site-experience";
import { SuperCursor } from "@/components/client/super-cursor";
import { VerificationCore } from "@/components/client/verification-core";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { ConfidentialProject } from "@/components/sections/confidential-project";
import { NiftyResearch } from "@/components/sections/nifty-research";
import { MotoSim } from "@/components/sections/motosim";
import { Experiments } from "@/components/sections/experiments";
import { Capabilities } from "@/components/sections/capabilities";
import { Method } from "@/components/sections/method";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteExperience />
      <SuperCursor />
      <Navigation />
      <VerificationCore />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Manifesto />
        <section className="work" id="work">
          <header className="work-intro content-wide" data-reveal>
            <p>Selected work</p>
            <h2>Different problems<br /><em>deserve different worlds.</em></h2>
            <span>Three flagship systems, each told through the behaviour that makes it matter.</span>
          </header>
          <ConfidentialProject />
          <NiftyResearch />
          <MotoSim />
        </section>
        <Experiments />
        <Capabilities />
        <Method />
        <About />
      </main>
      <Contact />
    </>
  );
}
