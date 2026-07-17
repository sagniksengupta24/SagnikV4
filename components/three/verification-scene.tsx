"use client";

import { ContactShadows, Environment, Lightformer, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const states = ["claim", "decompose", "test", "fail", "evidence", "ship"] as const;
type State = (typeof states)[number];

type SceneProps = { active: boolean; onFailure: () => void };
type ScrollDetail = { progress: number; velocity: number; y: number };
type CursorFocusDetail = { active: boolean; label: string; x: number; y: number };
type CursorPulseDetail = { x: number; y: number; interactive: boolean };

type Snapshot = {
  object: THREE.Object3D;
  position: THREE.Vector3;
  rotation: THREE.Euler;
};

const partMotion: Record<string, [number, number, number]> = {
  Panel_Front: [0, 0, 1],
  Panel_Back: [0, 0, -1],
  Panel_Left: [-1, 0, 0],
  Panel_Right: [1, 0, 0],
  Panel_Top: [0, 1, 0],
  Panel_Bottom: [0, -1, 0],
};

const stateConfig: Record<State, {
  open: number;
  spread: number;
  rotation: [number, number, number];
  color: string;
  scale: number;
  orbit: number;
}> = {
  claim: { open: 0, spread: 0, rotation: [0.08, -0.35, 0.02], color: "#e9f0ff", scale: 0.9, orbit: 0.72 },
  decompose: { open: 0.42, spread: 0.3, rotation: [0.02, 0.72, -0.04], color: "#7797e8", scale: 0.84, orbit: 0.36 },
  test: { open: 0.72, spread: 0.58, rotation: [0.16, 1.62, 0.06], color: "#eef2ff", scale: 0.9, orbit: 0.5 },
  fail: { open: 0.84, spread: 0.76, rotation: [-0.12, 2.5, 0.14], color: "#d76a4b", scale: 0.84, orbit: 0.76 },
  evidence: { open: 0.38, spread: 0.22, rotation: [0.04, 3.38, -0.03], color: "#e18943", scale: 0.9, orbit: 0.62 },
  ship: { open: 0.06, spread: 0, rotation: [0, 4.25, 0], color: "#e9f0ff", scale: 0.78, orbit: 0.28 },
};

const cameraConfig: Record<State, [number, number, number]> = {
  claim: [5.2, 2.8, 7.4],
  decompose: [4.8, 3.15, 7.05],
  test: [5.75, 2.35, 7.2],
  fail: [4.45, 2.95, 7.65],
  evidence: [5.45, 2.2, 7.1],
  ship: [5.75, 3.05, 7.8],
};

function damp(current: number, target: number, smoothing: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-smoothing * delta));
}

function NarrativeRig({ active }: { active: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { invalidate } = useThree();
  const stateRef = useRef<State>("claim");
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const stateHandler = (event: Event) => {
      const next = ((event as CustomEvent<string>).detail || "claim") as State;
      if (states.includes(next)) stateRef.current = next;
      invalidate();
    };
    const scrollHandler = (event: Event) => {
      const detail = (event as CustomEvent<ScrollDetail>).detail;
      progressRef.current = detail?.progress ?? 0;
      velocityRef.current = detail?.velocity ?? 0;
      invalidate();
    };
    const pointerHandler = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerRef.current.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      invalidate();
    };

    window.addEventListener("verification-state", stateHandler);
    window.addEventListener("portfolio-scroll", scrollHandler);
    window.addEventListener("pointermove", pointerHandler, { passive: true });
    return () => {
      window.removeEventListener("verification-state", stateHandler);
      window.removeEventListener("portfolio-scroll", scrollHandler);
      window.removeEventListener("pointermove", pointerHandler);
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    const camera = cameraRef.current;
    if (!active || !camera) return;
    const target = cameraConfig[stateRef.current];
    const velocity = THREE.MathUtils.clamp(velocityRef.current, -2.2, 2.2);
    const progressWave = Math.sin(progressRef.current * Math.PI * 5) * 0.08;
    const targetX = target[0] + pointerRef.current.x * 0.16;
    const targetY = target[1] - pointerRef.current.y * 0.12 + progressWave;
    const targetZ = target[2] + Math.abs(velocity) * 0.12;

    camera.position.x = damp(camera.position.x, targetX, 2.8, delta);
    camera.position.y = damp(camera.position.y, targetY, 2.8, delta);
    camera.position.z = damp(camera.position.z, targetZ, 3.2, delta);
    camera.lookAt(0, 0, 0);
    velocityRef.current *= Math.pow(0.88, delta * 60);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={cameraConfig.claim} fov={35} />;
}

function EnergyArchitecture({ active }: { active: boolean }) {
  const orbitRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const stateRef = useRef<State>("claim");
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const pulseStrengthRef = useRef(0);
  const focusRef = useRef(0);
  const focusTargetRef = useRef(0);
  const orbitStrengthRef = useRef(stateConfig.claim.orbit);
  const colorRef = useRef(new THREE.Color(stateConfig.claim.color));
  const { invalidate } = useThree();

  const positions = useMemo(() => {
    const count = 220;
    const array = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 2.25 + ((index * 73) % 100) / 100 * 1.85;
      const theta = index * 2.399963229728653;
      const y = 1 - (index / Math.max(count - 1, 1)) * 2;
      const radial = Math.sqrt(Math.max(0, 1 - y * y));
      array[index * 3] = Math.cos(theta) * radial * radius;
      array[index * 3 + 1] = y * radius * 0.72;
      array[index * 3 + 2] = Math.sin(theta) * radial * radius;
    }
    return array;
  }, []);

  useEffect(() => {
    const stateHandler = (event: Event) => {
      const next = ((event as CustomEvent<string>).detail || "claim") as State;
      if (!states.includes(next)) return;
      stateRef.current = next;
      orbitStrengthRef.current = stateConfig[next].orbit;
      colorRef.current.set(stateConfig[next].color);
      invalidate();
    };
    const scrollHandler = (event: Event) => {
      const detail = (event as CustomEvent<ScrollDetail>).detail;
      progressRef.current = detail?.progress ?? 0;
      velocityRef.current = detail?.velocity ?? 0;
      invalidate();
    };
    const focusHandler = (event: Event) => {
      const detail = (event as CustomEvent<CursorFocusDetail>).detail;
      focusTargetRef.current = detail?.active ? 1 : 0;
      invalidate();
    };
    const pulseHandler = () => {
      pulseStrengthRef.current = 1;
      invalidate();
    };

    window.addEventListener("verification-state", stateHandler);
    window.addEventListener("portfolio-scroll", scrollHandler);
    window.addEventListener("cursor-focus", focusHandler);
    window.addEventListener("cursor-pulse", pulseHandler);
    return () => {
      window.removeEventListener("verification-state", stateHandler);
      window.removeEventListener("portfolio-scroll", scrollHandler);
      window.removeEventListener("cursor-focus", focusHandler);
      window.removeEventListener("cursor-pulse", pulseHandler);
    };
  }, [invalidate]);

  useFrame((state, delta) => {
    if (!active) return;
    const elapsed = state.clock.elapsedTime;
    const velocity = THREE.MathUtils.clamp(velocityRef.current, -2, 2);
    pulseStrengthRef.current = damp(pulseStrengthRef.current, 0, 3.6, delta);
    focusRef.current = damp(focusRef.current, focusTargetRef.current, 4.2, delta);

    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * (0.07 + Math.abs(velocity) * 0.16);
      orbitRef.current.rotation.z = Math.sin(elapsed * 0.22 + progressRef.current * Math.PI * 4) * 0.09;
      const scale = 1 + pulseStrengthRef.current * 0.1 + focusRef.current * 0.015;
      orbitRef.current.scale.setScalar(scale);
      orbitRef.current.children.forEach((child, index) => {
        if (!(child instanceof THREE.Mesh)) return;
        const material = child.material as THREE.MeshBasicMaterial;
        material.color.lerp(colorRef.current, 0.08);
        material.opacity = (0.055 + orbitStrengthRef.current * 0.08) * (1 - index * 0.08) + pulseStrengthRef.current * 0.08;
      });
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * (0.025 + Math.abs(velocity) * 0.08);
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.13) * 0.08;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.color.lerp(colorRef.current, 0.06);
      material.opacity = 0.13 + orbitStrengthRef.current * 0.12 + focusRef.current * 0.05;
      material.size = 0.022 + pulseStrengthRef.current * 0.015;
    }

    if (pulseRef.current) {
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      const scale = 1 + (1 - pulseStrengthRef.current) * 1.3;
      pulseRef.current.scale.setScalar(scale);
      material.color.lerp(colorRef.current, 0.15);
      material.opacity = pulseStrengthRef.current * 0.16;
    }

    velocityRef.current *= Math.pow(0.86, delta * 60);
  });

  return (
    <group>
      <group ref={orbitRef}>
        <mesh rotation={[Math.PI / 2.7, 0.18, 0.32]}>
          <torusGeometry args={[2.42, 0.009, 8, 180]} />
          <meshBasicMaterial transparent opacity={0.12} color={stateConfig.claim.color} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[0.36, Math.PI / 2.4, -0.46]}>
          <torusGeometry args={[2.86, 0.007, 8, 180]} />
          <meshBasicMaterial transparent opacity={0.09} color="#7797e8" blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh rotation={[-0.42, -0.28, Math.PI / 2.1]}>
          <torusGeometry args={[3.24, 0.006, 8, 180]} />
          <meshBasicMaterial transparent opacity={0.07} color="#e18943" blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial transparent opacity={0.2} size={0.024} color="#b8c7ff" blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      <mesh ref={pulseRef}>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial wireframe transparent opacity={0} color="#e9f0ff" blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CoreModel({ active }: { active: boolean }) {
  const { scene } = useGLTF("/models/scroll-tech-core.glb");
  const model = useMemo(() => scene.clone(true), [scene]);
  const outerRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const snapshots = useRef<Snapshot[]>([]);
  const energyMaterials = useRef<THREE.MeshStandardMaterial[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef({ progress: 0, velocity: 0 });
  const focusRef = useRef(0);
  const focusTargetRef = useRef(0);
  const pulseRef = useRef(0);
  const currentState = useRef<State>("claim");
  const { invalidate } = useThree();

  const modelParts = useMemo(() => {
    const objects: THREE.Object3D[] = [];
    const energized: THREE.MeshStandardMaterial[] = [];

    model.traverse((object) => {
      if (partMotion[object.name] || object.name.startsWith("Fragment_")) objects.push(object);
      if (!(object instanceof THREE.Mesh)) return;

      const source = Array.isArray(object.material) ? object.material : [object.material];
      const cloned = source.map((material) => material.clone());
      object.material = Array.isArray(object.material) ? cloned : cloned[0];

      cloned.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.roughness = 0.28;
        material.metalness = 0.82;
        material.envMapIntensity = 1.45;
        const isEnergy = object.name === "Core" || object.name.startsWith("EnergyRing_");
        material.emissive.set(isEnergy ? "#5276c7" : "#0a1120");
        material.emissiveIntensity = isEnergy ? 0.48 : 0.07;
        if (isEnergy) energized.push(material);
      });
    });

    return { objects, energized };
  }, [model]);

  const movingParts = modelParts.objects;

  useLayoutEffect(() => {
    energyMaterials.current = modelParts.energized;
    snapshots.current = movingParts.map((object) => ({
      object,
      position: object.position.clone(),
      rotation: object.rotation.clone(),
    }));
    invalidate();
  }, [invalidate, modelParts, movingParts]);

  useEffect(() => {
    const apply = (next: State) => {
      if (!rootRef.current || !states.includes(next)) return;
      currentState.current = next;
      const config = stateConfig[next];
      const targetColor = new THREE.Color(config.color);
      const timeline = gsap.timeline({
        defaults: {
          duration: active ? 1.2 : 0.01,
          ease: "power3.inOut",
          onUpdate: invalidate,
        },
      });

      timeline.to(rootRef.current.rotation, { x: config.rotation[0], y: config.rotation[1], z: config.rotation[2] }, 0);
      timeline.to(rootRef.current.scale, { x: config.scale, y: config.scale, z: config.scale }, 0);

      snapshots.current.forEach((snapshot, index) => {
        const mapped = partMotion[snapshot.object.name];
        const direction = mapped
          ? new THREE.Vector3(...mapped)
          : snapshot.position.lengthSq() > 0.001
            ? snapshot.position.clone().normalize()
            : new THREE.Vector3(Math.sin(index), Math.cos(index), Math.sin(index * 0.7));
        const failurePath = next === "fail" && index % 4 === 0;
        const distance = config.spread * (0.08 + (index % 7) * 0.025);

        timeline.to(snapshot.object.position, {
          x: snapshot.position.x + direction.x * distance + (failurePath ? 0.32 : 0),
          y: snapshot.position.y + direction.y * distance - (failurePath ? 0.18 : 0),
          z: snapshot.position.z + direction.z * distance,
        }, 0);
        timeline.to(snapshot.object.rotation, {
          x: snapshot.rotation.x + config.open * ((index % 3) - 1) * 0.12,
          y: snapshot.rotation.y + config.open * ((index % 5) - 2) * 0.08,
          z: snapshot.rotation.z + config.open * ((index % 4) - 1.5) * 0.09,
        }, 0);
      });

      energyMaterials.current.forEach((material) => {
        timeline.to(material.emissive, { r: targetColor.r * 0.45, g: targetColor.g * 0.45, b: targetColor.b * 0.45 }, 0);
      });
      if (lightRef.current) timeline.to(lightRef.current.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b }, 0);
      timeline.eventCallback("onComplete", invalidate);
    };

    const stateHandler = (event: Event) => apply(((event as CustomEvent<string>).detail || "claim") as State);
    const scrollHandler = (event: Event) => {
      const detail = (event as CustomEvent<ScrollDetail>).detail;
      scrollRef.current.progress = detail?.progress ?? 0;
      scrollRef.current.velocity = detail?.velocity ?? 0;
      invalidate();
    };
    const focusHandler = (event: Event) => {
      const detail = (event as CustomEvent<CursorFocusDetail>).detail;
      focusTargetRef.current = detail?.active ? 1 : 0;
      invalidate();
    };
    const pulseHandler = (event: Event) => {
      const detail = (event as CustomEvent<CursorPulseDetail>).detail;
      pulseRef.current = detail?.interactive ? 1 : 0.68;
      invalidate();
    };
    const pointerHandler = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerRef.current.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
      invalidate();
    };

    window.addEventListener("verification-state", stateHandler);
    window.addEventListener("portfolio-scroll", scrollHandler);
    window.addEventListener("cursor-focus", focusHandler);
    window.addEventListener("cursor-pulse", pulseHandler);
    window.addEventListener("pointermove", pointerHandler, { passive: true });
    apply((document.documentElement.dataset.verificationState || "claim") as State);

    return () => {
      window.removeEventListener("verification-state", stateHandler);
      window.removeEventListener("portfolio-scroll", scrollHandler);
      window.removeEventListener("cursor-focus", focusHandler);
      window.removeEventListener("cursor-pulse", pulseHandler);
      window.removeEventListener("pointermove", pointerHandler);
    };
  }, [active, invalidate]);

  useFrame((state, delta) => {
    if (!active || !outerRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const velocity = THREE.MathUtils.clamp(scrollRef.current.velocity, -2.3, 2.3);
    pulseRef.current = damp(pulseRef.current, 0, 3.8, delta);
    focusRef.current = damp(focusRef.current, focusTargetRef.current, 4.2, delta);

    outerRef.current.position.x = damp(outerRef.current.position.x, pointerRef.current.x * 0.13, 2.2, delta);
    outerRef.current.position.y = damp(outerRef.current.position.y, -pointerRef.current.y * 0.09 + Math.sin(elapsed * 0.31) * 0.025, 2.2, delta);
    outerRef.current.rotation.x = damp(outerRef.current.rotation.x, -pointerRef.current.y * 0.055, 2.6, delta);
    outerRef.current.rotation.z = damp(outerRef.current.rotation.z, pointerRef.current.x * 0.035 + Math.sin(scrollRef.current.progress * Math.PI * 6) * 0.012, 2.6, delta);
    outerRef.current.rotation.y += delta * (0.028 + Math.abs(velocity) * 0.12 + focusRef.current * 0.018);

    const pulseScale = 1 + pulseRef.current * 0.075;
    outerRef.current.scale.setScalar(pulseScale);

    if (lightRef.current) {
      lightRef.current.position.x = damp(lightRef.current.position.x, pointerRef.current.x * 4.5, 2.2, delta);
      lightRef.current.position.y = damp(lightRef.current.position.y, -pointerRef.current.y * 3.2, 2.2, delta);
      lightRef.current.intensity = damp(lightRef.current.intensity, 18 + focusRef.current * 7 + pulseRef.current * 15, 4, delta);
    }

    energyMaterials.current.forEach((material, index) => {
      const shimmer = Math.sin(elapsed * 1.3 + index * 0.7) * 0.045;
      material.emissiveIntensity = 0.48 + shimmer + focusRef.current * 0.18 + pulseRef.current * 0.55;
    });

    scrollRef.current.velocity *= Math.pow(0.86, delta * 60);
  });

  return (
    <group ref={outerRef}>
      <group ref={rootRef} rotation={stateConfig.claim.rotation} scale={stateConfig.claim.scale}>
        <primitive object={model} />
        <pointLight ref={lightRef} color="#e9f0ff" intensity={18} distance={11} decay={2} position={[1, 1, 3]} />
      </group>
    </group>
  );
}

export default function VerificationScene({ active, onFailure }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [5.2, 2.8, 7.4], fov: 35 }}
      dpr={[1, 1.4]}
      frameloop={active ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        try {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = 1.08;
        } catch {
          onFailure();
        }
      }}
      onError={onFailure}
    >
      <fog attach="fog" args={["#05070f", 7.5, 14]} />
      <hemisphereLight args={["#cbd8ef", "#03050b", 1.05]} />
      <directionalLight position={[4, 6, 5]} color="#f5f7ff" intensity={2.1} />
      <NarrativeRig active={active} />
      <Suspense fallback={null}>
        <EnergyArchitecture active={active} />
        <CoreModel active={active} />
        <ContactShadows position={[0, -2.3, 0]} opacity={0.32} scale={7} blur={2.8} far={5} frames={1} />
        <Environment resolution={64}>
          <Lightformer form="rect" intensity={2.6} color="#f5f7ff" position={[0, 4, 5]} scale={[7, 2, 1]} />
          <Lightformer form="rect" intensity={2.2} color="#5878c8" position={[-4, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={1.4} color="#7567a8" position={[4, -1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 2, 1]} />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/scroll-tech-core.glb");
