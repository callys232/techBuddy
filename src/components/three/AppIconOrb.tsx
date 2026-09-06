"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import type * as THREE from "three";

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

/** Soft pastel blob that gently turns to face the cursor — the "interactive" part. */
function SoftBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useBrandColor();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Ease rotation toward pointer position — soft, not snappy.
    const targetY = state.pointer.x * 0.6;
    const targetX = -state.pointer.y * 0.4;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * Math.min(delta * 2, 1);
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * Math.min(delta * 2, 1);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          distort={0.45}
          speed={1.2}
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.22}
        />
      </Sphere>
    </Float>
  );
}

/**
 * Decorative, interactive 3D backdrop for the app icon — desktop only
 * (mounted via dynamic ssr:false + hidden below lg at the call site) so it
 * never touches the mobile bundle. Softly turns toward the cursor.
 */
export function AppIconOrb() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 3]} intensity={0.4} />
      <SoftBlob />
    </Canvas>
  );
}
