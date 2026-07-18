export const dynamic = "force-static";

import { ImageResponse } from "next/og";

export const alt = "Sagnik Sengupta — AI systems that earn trust.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#090a0e", color: "#f8f6f0", fontFamily: "Arial, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: 760, right: -280, top: -250, background: "radial-gradient(circle, rgba(65,105,225,.42), rgba(65,105,225,.08) 45%, transparent 70%)" }} />
      <div style={{ position: "absolute", right: 115, top: 145, width: 300, height: 300, border: "1px solid rgba(197,210,255,.28)", borderRadius: 300, transform: "rotateX(65deg)" }} />
      <div style={{ position: "absolute", right: 185, top: 215, width: 160, height: 160, border: "1px solid rgba(231,168,110,.38)", borderRadius: 160, transform: "rotateY(60deg)" }} />
      <div style={{ position: "absolute", right: 246, top: 276, width: 38, height: 38, background: "#b7c6ff", transform: "rotate(45deg)", boxShadow: "0 0 36px rgba(174,191,255,.72)" }} />
      <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "space-between", padding: "62px 70px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
          <span>SAGNIK SENGUPTA</span><span style={{ color: "#aebfff" }}>AI SYSTEMS · SOFTWARE · RESEARCH</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 830 }}>
          <strong style={{ fontSize: 82, lineHeight: .89, letterSpacing: -5 }}>I build AI systems</strong>
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#aebfff", fontSize: 88, lineHeight: .9, letterSpacing: -4 }}>that earn trust.</span>
          <span style={{ marginTop: 28, maxWidth: 650, color: "#aeb0ba", fontSize: 20, lineHeight: 1.45 }}>Local-first agents, machine-learning research, simulation and expressive technical products.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.16)", color: "#8f929c", fontSize: 16 }}>
          <span>IIT MADRAS · BS DATA SCIENCE</span><span>WEST BENGAL · INDIA</span>
        </div>
      </div>
    </div>, size,
  );
}
