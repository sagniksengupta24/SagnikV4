"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "[role='button']",
  "[data-cursor-label]",
].join(",");

type Point = { x: number; y: number };
type Palette = { color: string; rgb: string; tone: "light" | "dark" };

const palettes: Record<string, Palette> = {
  default: { color: "#b8c7ff", rgb: "184, 199, 255", tone: "dark" },
  paper: { color: "#2746bd", rgb: "39, 70, 189", tone: "light" },
  indus: { color: "#ffffff", rgb: "255, 255, 255", tone: "dark" },
  nifty: { color: "#b94b3f", rgb: "185, 75, 63", tone: "light" },
  moto: { color: "#ffad67", rgb: "255, 173, 103", tone: "dark" },
  contact: { color: "#d6deff", rgb: "214, 222, 255", tone: "dark" },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPalette(target: Element | null): Palette {
  if (!target) return palettes.default;
  if (target.closest(".project-moto")) return palettes.moto;
  if (target.closest(".project-nifty")) return palettes.nifty;
  if (target.closest(".project-indus")) return palettes.indus;
  if (target.closest(".manifesto, .experiments, .capabilities, .method, .about")) return palettes.paper;
  if (target.closest(".contact")) return palettes.contact;
  return palettes.default;
}

function getLabel(element: HTMLElement) {
  const explicit = element.dataset.cursorLabel?.trim();
  if (explicit) return explicit.slice(0, 20).toUpperCase();

  if (element instanceof HTMLAnchorElement) {
    if (element.href.startsWith("mailto:")) return "START A CONVERSATION";
    if (element.target === "_blank") return "OPEN PROJECT";
    if (element.hash === "#home") return "BACK TO TOP";
  }

  const aria = element.getAttribute("aria-label")?.trim();
  if (aria) return aria.split(/[,.]/)[0].slice(0, 20).toUpperCase();

  const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (/pause/i.test(text)) return "PAUSE";
  if (/play/i.test(text)) return "PLAY";
  if (/restart|retry|reset/i.test(text)) return "RESTART";
  return text.slice(0, 20).toUpperCase() || "VIEW";
}

function getRadius(element: HTMLElement, height: number) {
  const parsed = Number.parseFloat(window.getComputedStyle(element).borderRadius || "0");
  if (Number.isFinite(parsed) && parsed > 0) return clamp(parsed + 7, 12, height / 2 + 8);
  return clamp(height * 0.32, 12, 30);
}

export function SuperCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    const root = rootRef.current;
    const lens = lensRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const trails = trailRefs.current.filter((node): node is HTMLSpanElement => Boolean(node));
    if (!root || !lens || !dot || !label || trails.length === 0) return;

    document.documentElement.dataset.superCursor = "true";

    const pointer: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const prior: Point = { ...pointer };
    const dotPosition: Point = { ...pointer };
    const lensPosition: Point = { ...pointer };
    const trailPositions = trails.map(() => ({ ...pointer }));
    let lensWidth = 54;
    let lensHeight = 54;
    let activeTarget: HTMLElement | null = null;
    let activeRect: DOMRect | null = null;
    let activeRadius = 27;
    let animationFrame = 0;
    let lastTimestamp = performance.now();

    const emitFocus = (active: boolean, text = "") => {
      window.dispatchEvent(new CustomEvent("cursor-focus", {
        detail: {
          active,
          label: text,
          x: pointer.x / Math.max(window.innerWidth, 1),
          y: pointer.y / Math.max(window.innerHeight, 1),
        },
      }));
    };

    const setPalette = (target: Element | null) => {
      const palette = getPalette(target);
      root.style.setProperty("--super-cursor-color", palette.color);
      root.style.setProperty("--super-cursor-rgb", palette.rgb);
      root.dataset.tone = palette.tone;
    };

    const setTarget = (next: HTMLElement | null) => {
      if (next === activeTarget) return;
      activeTarget = next;
      activeRect = activeTarget?.getBoundingClientRect() ?? null;
      const text = activeTarget ? getLabel(activeTarget) : "";
      root.dataset.active = activeTarget ? "true" : "false";
      label.textContent = text;
      if (activeTarget && activeRect) activeRadius = getRadius(activeTarget, activeRect.height);
      emitFocus(Boolean(activeTarget), text);
    };

    const updateTarget = (x: number, y: number) => {
      const hovered = document.elementFromPoint(x, y);
      setPalette(hovered);
      setTarget(hovered?.closest<HTMLElement>(INTERACTIVE_SELECTOR) ?? null);
      const reading = !activeTarget && Boolean(hovered?.closest("h1, h2, h3, blockquote, [data-cursor-reading]"));
      root.dataset.reading = reading ? "true" : "false";
    };

    const onPointerMove = (event: PointerEvent) => {
      prior.x = pointer.x;
      prior.y = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      root.dataset.visible = "true";
      updateTarget(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      root.dataset.visible = "false";
      setTarget(null);
    };

    const onPointerEnter = () => {
      root.dataset.visible = "true";
    };

    const createRipple = () => {
      const ripple = document.createElement("span");
      ripple.className = "super-cursor__ripple";
      ripple.style.left = `${pointer.x}px`;
      ripple.style.top = `${pointer.y}px`;
      root.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    };

    const onPointerDown = () => {
      root.dataset.pressed = "true";
      createRipple();
      window.dispatchEvent(new CustomEvent("cursor-pulse", {
        detail: {
          x: pointer.x / Math.max(window.innerWidth, 1),
          y: pointer.y / Math.max(window.innerHeight, 1),
          interactive: Boolean(activeTarget),
        },
      }));
    };

    const onPointerUp = () => {
      root.dataset.pressed = "false";
    };

    const refreshRect = () => {
      if (activeTarget) activeRect = activeTarget.getBoundingClientRect();
    };

    const animate = (timestamp: number) => {
      const delta = clamp((timestamp - lastTimestamp) / 16.67, 0.45, 2);
      lastTimestamp = timestamp;
      const dotEase = 1 - Math.pow(1 - 0.58, delta);
      const lensEase = 1 - Math.pow(1 - 0.18, delta);

      dotPosition.x += (pointer.x - dotPosition.x) * dotEase;
      dotPosition.y += (pointer.y - dotPosition.y) * dotEase;

      if (activeTarget) activeRect = activeTarget.getBoundingClientRect();
      const desiredX = activeRect ? activeRect.left + activeRect.width / 2 : pointer.x;
      const desiredY = activeRect ? activeRect.top + activeRect.height / 2 : pointer.y;
      const desiredWidth = activeRect ? clamp(activeRect.width + 18, 46, window.innerWidth * 0.72) : root.dataset.reading === "true" ? 78 : 54;
      const desiredHeight = activeRect ? clamp(activeRect.height + 16, 42, 180) : root.dataset.reading === "true" ? 78 : 54;

      lensPosition.x += (desiredX - lensPosition.x) * lensEase;
      lensPosition.y += (desiredY - lensPosition.y) * lensEase;
      lensWidth += (desiredWidth - lensWidth) * lensEase;
      lensHeight += (desiredHeight - lensHeight) * lensEase;

      const speed = clamp(Math.hypot(pointer.x - prior.x, pointer.y - prior.y), 0, 44);
      const skew = activeRect ? 0 : clamp((pointer.x - prior.x) * 0.3, -10, 10);
      const stretchX = activeRect ? 1 : 1 + speed * 0.006;
      const stretchY = activeRect ? 1 : 1 - speed * 0.002;

      dot.style.transform = `translate3d(${dotPosition.x}px, ${dotPosition.y}px, 0) translate(-50%, -50%)`;
      lens.style.width = `${lensWidth}px`;
      lens.style.height = `${lensHeight}px`;
      lens.style.borderRadius = `${activeRect ? activeRadius : lensHeight / 2}px`;
      lens.style.transform = `translate3d(${lensPosition.x}px, ${lensPosition.y}px, 0) translate(-50%, -50%) rotate(${skew}deg) scale(${stretchX}, ${stretchY})`;

      label.style.transform = `translate3d(${lensPosition.x}px, ${lensPosition.y}px, 0) translate(-50%, -50%)`;

      let follow = pointer;
      trails.forEach((trail, index) => {
        const position = trailPositions[index];
        const ease = 0.22 - index * 0.028;
        position.x += (follow.x - position.x) * ease;
        position.y += (follow.y - position.y) * ease;
        trail.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
        follow = position;
      });

      prior.x += (pointer.x - prior.x) * 0.35;
      prior.y += (pointer.y - prior.y) * 0.35;
      animationFrame = requestAnimationFrame(animate);
    };

    document.documentElement.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("pointerenter", onPointerEnter);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.documentElement.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("pointerenter", onPointerEnter);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
      delete document.documentElement.dataset.superCursor;
    };
  }, [finePointer, reducedMotion]);

  return (
    <div ref={rootRef} className="super-cursor" aria-hidden="true" data-visible="false" data-active="false" data-pressed="false">
      <div ref={lensRef} className="super-cursor__lens"><i /><b /></div>
      {Array.from({ length: 4 }, (_, index) => (
        <span
          key={index}
          ref={(node) => { trailRefs.current[index] = node; }}
          className="super-cursor__trail"
          style={{ "--trail-index": index } as React.CSSProperties}
        />
      ))}
      <div ref={dotRef} className="super-cursor__dot" />
      <div ref={labelRef} className="super-cursor__label" />
    </div>
  );
}
