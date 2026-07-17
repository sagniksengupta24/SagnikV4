"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type ReplayFrame = {
  step: number;
  position: number;
  heat: number;
  slope: number;
  gear: number;
  throttle: boolean;
  bog: number;
};

const TRACK_POINTS = 1000;
const GOAL = TRACK_POINTS - 1;
const MAX_STEPS = 3000;
const POWERS = [0.8, 0.6, 0.4, 0.2, 0.1];
const HEATS = [25, 15, 10, 5, 2];

function seededRandom(seed = 24) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function buildReplay() {
  const track = Array.from({ length: TRACK_POINTS }, (_, index) => {
    const x = (index / (TRACK_POINTS - 1)) * 50;
    return Math.round((5 * Math.sin(x) + 3 * Math.sin(2.5 * x) + 10) * 10) / 10;
  });
  const random = seededRandom(3);
  const frames: ReplayFrame[] = [];
  let position = 0;
  let heat = 0;
  let bog = 0;

  for (let step = 1; step <= MAX_STEPS && position < GOAL; step += 1) {
    const index = Math.min(Math.floor(position), GOAL - 1);
    const slope = Math.round((track[index + 1] - track[index]) * 10) / 10;
    const throttle = heat < 70;
    const requiredPower = slope + 0.08;
    const validGears = POWERS.map((power, gear) => ({ power, gear })).filter(({ power }) => power >= requiredPower);
    const gear = validGears.length ? validGears[validGears.length - 1].gear : 0;
    const wear = (step / MAX_STEPS) * 0.2;
    const powerModifier = bog > 0 ? 0.3 : 1;

    if (bog > 0) bog -= 1;
    if (random() < 0.01) bog = 15;

    let power = 0;
    if (throttle) {
      power = POWERS[gear] * (1 - wear) * powerModifier;
      heat += HEATS[gear];
    } else {
      heat = Math.max(0, heat - (heat < 75 ? 20 : 5));
    }

    if (heat >= 100) break;
    if (power >= slope) position = Math.min(position + 1, GOAL);
    else if (slope > 0.4) position = Math.max(0, position - 0.2);

    if (step === 1 || step % 12 === 0 || position >= GOAL) {
      frames.push({ step, position, heat, slope, gear: gear + 1, throttle, bog });
    }
  }

  return { track, frames };
}

function trackPath(track: number[]) {
  const min = Math.min(...track);
  const max = Math.max(...track);
  return track
    .filter((_, index) => index % 8 === 0 || index === track.length - 1)
    .map((value, index, points) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 78 - ((value - min) / (max - min)) * 48;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function MotoSimReplay() {
  const replay = useMemo(() => buildReplay(), []);
  const path = useMemo(() => trackPath(replay.track), [replay.track]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const frame = replay.frames[Math.min(frameIndex, replay.frames.length - 1)];
  const progress = (frame.position / GOAL) * 100;
  const bikeX = 3 + progress * 0.94;
  const trackIndex = Math.min(Math.floor(frame.position), GOAL);
  const trackMin = Math.min(...replay.track);
  const trackMax = Math.max(...replay.track);
  const bikeY = 78 - ((replay.track[trackIndex] - trackMin) / (trackMax - trackMin)) * 48;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1 >= replay.frames.length ? 0 : current + 1));
    }, 92);
    return () => window.clearInterval(timer);
  }, [inView, playing, reducedMotion, replay.frames.length]);

  return (
    <div className="motosim-replay" ref={rootRef}>
      <div className="moto-sky" aria-hidden="true"><i /><i /><i /></div>
      <svg className="replay-track" viewBox="0 0 100 100" role="img" aria-label={`Motorcycle simulation replay at ${Math.round(progress)} percent progress and ${Math.round(frame.heat)} degrees Celsius`}>
        <defs>
          <linearGradient id="mountain-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b1914" />
            <stop offset="1" stopColor="#0b0807" />
          </linearGradient>
        </defs>
        <path className="mountain-fill" d={`${path} L100 100 L0 100 Z`} />
        <path className="mountain-ridge" d={path} />
        <path className="travelled-ridge" d={path} pathLength="100" strokeDasharray={`${progress} ${100 - progress}`} />
        <g className="replay-bike" transform={`translate(${bikeX.toFixed(2)} ${bikeY.toFixed(2)})`}>
          <circle cx="-2.6" cy="2.2" r="2.1" />
          <circle cx="3.2" cy="2.2" r="2.1" />
          <path d="M-2.6 2.2 0-1.4 3.2 2.2M0-1.4 1.8-3.8M-1.2-1.1 2.1-.7" />
        </g>
      </svg>

      <div className="moto-overlay">
        <div className="moto-progress"><strong>{Math.round(progress)}</strong><span>% of the climb</span></div>
        <div className="moto-heat" data-hot={frame.heat > 80}><strong>{Math.round(frame.heat)}°</strong><span>engine memory</span></div>
        <p>{frame.bog > 0 ? "A delayed failure changes the next decision." : frame.throttle ? "Push now, but carry the heat forward." : "Cooling is also an action."}</p>
      </div>

      <div className="moto-controls">
        <button type="button" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>{playing ? "Pause replay" : "Play replay"}</button>
        <button type="button" onClick={() => { setFrameIndex(0); setPlaying(false); }}>Restart</button>
        <span>Gear {frame.gear} · slope {frame.slope.toFixed(1)} · step {frame.step}</span>
      </div>
    </div>
  );
}
