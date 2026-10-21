"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface RuiCharacterProps {
  className?: string;
  reducedMotion?: boolean;
}

type PointerTarget = {
  x: number;
  y: number;
  active: boolean;
};

function CharacterModel({
  pointer,
  reducedMotion,
}: {
  pointer: React.RefObject<PointerTarget>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/portfolio-character.glb");
  const head = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    head.current = scene.getObjectByName("Head") ?? scene.getObjectByName("mixamorig:Head") ?? null;
    return () => {
      head.current = null;
    };
  }, [scene]);

  useFrame(({ size, viewport }, delta) => {
    const character = group.current;
    if (!character) return;

    const cursor = pointer.current;
    const mobile = size.width < 720;
    const x = cursor?.active ? cursor.x : 0;
    const y = cursor?.active ? cursor.y : 0;
    const scale = mobile ? 1.18 : 1.55;
    const baseX = Math.min(viewport.width * 0.235, mobile ? 0.58 : 1.38);

    character.position.x = reducedMotion ? baseX : THREE.MathUtils.damp(character.position.x, baseX + x * 0.12, 2.2, delta);
    character.position.y = reducedMotion ? -0.74 : THREE.MathUtils.damp(character.position.y, -0.74 + y * 0.055, 2.2, delta);
    character.rotation.y = THREE.MathUtils.damp(character.rotation.y, x * 0.13, 2.4, delta);
    character.rotation.x = THREE.MathUtils.damp(character.rotation.x, -y * 0.035, 2.4, delta);
    character.scale.setScalar(reducedMotion ? scale : THREE.MathUtils.damp(character.scale.x, scale, 2, delta));
    if (reducedMotion) return;

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, x * 0.15, 2.8, delta);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, -y * 0.07, 2.8, delta);
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} position={[0, -0.78, 0]} />
    </group>
  );
}

function CharacterLoader() {
  return (
    <Html center>
      <span className="model-loader" role="status">
        Loading the portrait
      </span>
    </Html>
  );
}

function InkTrail({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".hero");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !hero || !context || reducedMotion) return;

    const points: Array<{ x: number; y: number; life: number; speed: number }> = [];
    let frame = 0;
    let lastPoint: { x: number; y: number } | undefined;
    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const rect = hero.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const point = points[index];
        const midpointX = (previous.x + point.x) / 2;
        const midpointY = (previous.y + point.y) / 2;
        const alpha = Math.min(previous.life, point.life) * 0.24;
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.quadraticCurveTo(previous.x, previous.y, midpointX, midpointY);
        context.strokeStyle = `rgba(13, 13, 13, ${alpha})`;
        context.lineWidth = Math.min(8, 2.4 + point.speed * 0.075) * Math.min(previous.life, point.life);
        context.lineCap = "round";
        context.lineJoin = "round";
        context.shadowColor = `rgba(0, 0, 0, ${alpha * 0.35})`;
        context.shadowBlur = 7;
        context.stroke();
      }
      context.shadowBlur = 0;
      for (let index = points.length - 1; index >= 0; index -= 1) {
        points[index].life -= 0.008;
        if (points[index].life <= 0) points.splice(index, 1);
      }
      if (points.length > 1) frame = window.requestAnimationFrame(draw);
      else frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const rect = hero.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const speed = lastPoint ? Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) : 0;
      points.push({ ...point, speed, life: 1 });
      if (points.length > 46) points.splice(0, points.length - 46);
      lastPoint = point;
      if (!frame) frame = window.requestAnimationFrame(draw);
    };
    const onPointerLeave = () => {
      lastPoint = undefined;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="hero-ink-trail" aria-hidden="true" />;
}

export default function RuiCharacter({
  className = "",
  reducedMotion = false,
}: RuiCharacterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const hero = rootRef.current?.closest<HTMLElement>(".hero");
    if (!hero) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = 1 - ((event.clientY - rect.top) / rect.height) * 2;
      pointer.current.active = true;
      rootRef.current?.style.setProperty("--pointer-x", `${pointer.current.x * 14}px`);
      rootRef.current?.style.setProperty("--pointer-y", `${pointer.current.y * 10}px`);
    };
    const onPointerLeave = () => {
      pointer.current.active = false;
      rootRef.current?.style.setProperty("--pointer-x", "0px");
      rootRef.current?.style.setProperty("--pointer-y", "0px");
    };

    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`rui-character ${className}`}
      role="img"
      aria-label="Interactive 3D portrait of a woman"
    >
      <InkTrail reducedMotion={reducedMotion} />
      <span className="hero-ornament hero-ornament-ring" aria-hidden="true" />
      <span className="hero-ornament hero-ornament-star" aria-hidden="true">✳</span>
      <span className="hero-ornament hero-ornament-dot" aria-hidden="true" />
      <Canvas
        camera={{ position: [0, 0.15, 4.6], fov: 38 }}
        dpr={[1, 1.35]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => gl.setClearColor("#ffffff", 0)}
      >
        <ambientLight intensity={1.45} />
        <directionalLight position={[2, 4, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-3, 1, 2]} intensity={0.8} color="#d6d2cb" />
        <Suspense fallback={<CharacterLoader />}>
          <CharacterModel pointer={pointer} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}




