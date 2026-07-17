"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

gsap.registerPlugin(ScrollTrigger);

export function SiteExperience() {
  const progressRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    let frame = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();

    const update = () => {
      frame = 0;
      const now = performance.now();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      const elapsed = Math.max(now - lastTime, 16);
      const velocity = (window.scrollY - lastY) / elapsed;

      progress.style.transform = `scaleX(${value})`;
      window.dispatchEvent(new CustomEvent("portfolio-scroll", {
        detail: { progress: value, velocity, y: window.scrollY },
      }));

      lastY = window.scrollY;
      lastTime = now;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 42 }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-line-reveal]").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(0 0 100% 0)", y: 28 }, {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: element, scrub: 0.8, start: "top bottom", end: "bottom top" },
        });
      });
    });
    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-verification-state]"));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const state = visible ? (visible.target as HTMLElement).dataset.verificationState : undefined;
      if (!state) return;
      document.documentElement.dataset.verificationState = state;
      window.dispatchEvent(new CustomEvent("verification-state", { detail: state }));
    }, { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.25, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><i ref={progressRef} /></div>;
}
