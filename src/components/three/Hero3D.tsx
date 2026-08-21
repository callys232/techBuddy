"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import type * as THREE from "three";

/** Reads --brand from CSS so the blob follows the active theme (light/dark). */
function useBrandColor(): string {
  const [color, setColor] = useState("#1E3A8A");

  useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim();
      if (v) setColor(v);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => observer.disconnect();
  }, []);

  return color;
}

function BrandBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useBrandColor();

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <Icosahedron ref={meshRef} args={[1.6, 4]}>
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={1.5}
          roughness={0.3}
          transparent
          opacity={0.18}
          wireframe
        />
      </Icosahedron>
    </Float>
  );
}

/**
 * Decorative hero-only 3D scene. Mounted client-side only (dynamic ssr:false
 * at the call site) and skipped entirely under prefers-reduced-motion.
 */
export function Hero3D() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 2, 4]} intensity={0.5} />
      <BrandBlob />
    </Canvas>
  );
}
