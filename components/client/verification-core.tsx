"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { VerificationFallback } from "@/components/client/verification-fallback";
import { useMediaQuery } from "@/hooks/use-media-query";

const VerificationScene = dynamic(() => import("@/components/three/verification-scene"), { ssr: false });

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

export function VerificationCore() {
  const shellRef = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const desktop = useMediaQuery("(min-width: 980px) and (pointer: fine)");
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 8;
      const cores = navigator.hardwareConcurrency || 8;
      const automated = navigator.webdriver === true;
      let webgl = false;
      if (!automated) {
        const canvas = document.createElement("canvas");
        webgl = Boolean(canvas.getContext("webgl2", { powerPreference: "high-performance" }) || canvas.getContext("webgl"));
      }
      setEligible(desktop && !reduced && !automated && webgl && memory >= 4 && cores >= 4);
    });
    return () => cancelAnimationFrame(frame);
  }, [desktop, reduced]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "240px 0px" });
    observer.observe(shell);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <div className="verification-core-shell" ref={shellRef} aria-hidden="true">
      {eligible && !failed ? <VerificationScene active={visible} onFailure={() => setFailed(true)} /> : <VerificationFallback />}
    </div>
  );
}
