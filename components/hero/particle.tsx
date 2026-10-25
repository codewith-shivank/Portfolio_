"use client";

import { useEffect, useRef, useState } from "react";

interface Snippet {
  filename: string;
  lines: string[];
}

const SNIPPETS: Snippet[] = [
  {
    filename: "ParticleScene.ts",
    lines: [
      "const scene = new THREE.Scene();",
      "const count = 20000;",
      "const positions = new Float32Array(count * 3);",
      "",
      "for (let i = 0; i < count; i++) {",
      "  positions[i * 3]     = (Math.random() - 0.5) * 10;",
      "  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;",
      "  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;",
      "}",
      "",
      "const geometry = new THREE.BufferGeometry();",
      "geometry.setAttribute(",
      "  'position',",
      "  new THREE.BufferAttribute(positions, 3)",
      ");",
    ],
  },
  {
    filename: "WeatherService.ts",
    lines: [
      "async function fetchWeather(lat: number, lon: number) {",
      "  const res = await fetch(",
      "    `/api/forecast?lat=${lat}&lon=${lon}`",
      "  );",
      "  const { current, hourly } = await res.json();",
      "  return {",
      "    temp:     current.temp,",
      "    aqi:      current.air_quality.pm2_5,",
      "    forecast: hourly.slice(0, 24),",
      "  };",
      "}",
    ],
  },
  {
    filename: "CarShowroom.tsx",
    lines: [
      "useFrame(({ clock }) => {",
      "  const t = clock.getElapsedTime();",
      "  carMesh.rotation.y = t * 0.35;",
      "  camera.position.y  = Math.sin(t * 0.5) * 0.2 + 1.2;",
      "  material.uniforms.uTime.value = t;",
      "});",
    ],
  },
  {
    filename: "useRevealOnScroll.ts",
    lines: [
      "export function useRevealOnScroll() {",
      "  const observer = new IntersectionObserver(",
      "    (entries) => {",
      "      entries.forEach((entry) => {",
      "        entry.target.classList.toggle(",
      "          'is-visible', entry.isIntersecting",
      "        );",
      "      });",
      "    },",
      "    { threshold: 0.14 }",
      "  );",
      "}",
    ],
  },
];
interface ParticleProps {
  className?: string;
  reducedMotion?: boolean;
}

interface GlyphCell {
  char: string;
  opacity: number;
  targetOpacity: number;
  col: number;
  row: number;
  delay: number;
  isKeyword: boolean;
}

function buildCells(lines: string[]): GlyphCell[] {
  const cells: GlyphCell[] = [];
  lines.forEach((line, rowIndex) => {
    const keywordRanges: Array<{ start: number; end: number }> = [];
    const keywordRegex = /\b(const|let|var|for|if|else|async|function|return|export|new|await|type|interface)\b/g;
    let match;
    while ((match = keywordRegex.exec(line)) !== null) {
      keywordRanges.push({ start: match.index, end: match.index + match[0].length });
    }
    const chars = line.split("");
    chars.forEach((char, colIndex) => {
      if (char === " ") return;
      const isKeyword = keywordRanges.some((range) => colIndex >= range.start && colIndex < range.end);
      cells.push({
        char,
        opacity: 0,
        targetOpacity: 0.85,
        col: colIndex,
        row: rowIndex,
        delay: (rowIndex * 30 + colIndex) * 11,
        isKeyword,
      });
    });
  });
  return cells;
}

export default function Particle({
  className = "",
  reducedMotion = false,
}: ParticleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef({ x: 0.5, y: 0.5, active: false });
  const rafRef = useRef(0);
  const isVisible = useRef(true);
  const [activeFile, setActiveFile] = useState(SNIPPETS[0].filename);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasEl = canvas;
    const containerEl = container;
    const context = ctx;

    // Layout constants
    const FONT_SIZE = 13;
    const LINE_HEIGHT = 23;
    const CHAR_WIDTH = 7.82;
    const GUTTER_WIDTH = 46;
    const CODE_START_X = GUTTER_WIDTH + 14;
    const PADDING_Y = 22;
    const SNIPPET_CYCLE_MS = 4800;
    const CURSOR_INFLUENCE = 110;

    let cells: GlyphCell[] = [];
    let snippetIndex = 0;
    let snippetTimer = 0;
    let lastTs = 0;
    let pixelRatio = 1;

    function loadSnippet() {
      const snip = SNIPPETS[snippetIndex % SNIPPETS.length];
      setActiveFile(snip.filename);
      cells = buildCells(snip.lines);
    }

    function resize() {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = containerEl.getBoundingClientRect();
      canvasEl.width = Math.round(rect.width * pixelRatio);
      canvasEl.height = Math.round(rect.height * pixelRatio);
      canvasEl.style.width = `${rect.width}px`;
      canvasEl.style.height = `${rect.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      loadSnippet();
      drawStatic();
    }

    function drawStatic() {
      const rect = containerEl.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);
      context.font = `400 ${FONT_SIZE}px 'DM Mono', monospace`;
      context.textBaseline = "top";
      const snip = SNIPPETS[0];
      
      // Draw line numbers
      snip.lines.forEach((_, ri) => {
        const y = PADDING_Y + ri * LINE_HEIGHT;
        context.fillStyle = "rgba(23, 33, 31, 0.28)";
        context.fillText(String(ri + 1).padStart(2, "0"), 18, y);
      });

      // Draw separator rule
      context.strokeStyle = "rgba(23, 33, 31, 0.08)";
      context.beginPath();
      context.moveTo(GUTTER_WIDTH, 0);
      context.lineTo(GUTTER_WIDTH, rect.height);
      context.stroke();

      // Draw code
      snip.lines.forEach((line, ri) => {
        const chars = line.split("");
        chars.forEach((char, ci) => {
          const x = CODE_START_X + ci * CHAR_WIDTH;
          const y = PADDING_Y + ri * LINE_HEIGHT;
          context.fillStyle = "rgba(17, 17, 17, 0.72)";
          context.fillText(char, x, y);
        });
      });
    }

    function draw(ts: number) {
      const delta = Math.min(ts - lastTs, 60);
      lastTs = ts;

      snippetTimer += delta;
      if (snippetTimer >= SNIPPET_CYCLE_MS) {
        snippetTimer = 0;
        snippetIndex++;
        loadSnippet();
      }

      const rect = containerEl.getBoundingClientRect();
      const cx = cursorRef.current.active
        ? cursorRef.current.x * rect.width
        : rect.width * 0.65;
      const cy = cursorRef.current.active
        ? cursorRef.current.y * rect.height
        : rect.height * 0.45;

      const w = canvasEl.width / pixelRatio;
      const h = canvasEl.height / pixelRatio;
      context.clearRect(0, 0, w, h);

      context.font = `400 ${FONT_SIZE}px 'DM Mono', monospace`;
      context.textBaseline = "top";

      const currentSnippet = SNIPPETS[snippetIndex % SNIPPETS.length];

      // Draw line numbers
      currentSnippet.lines.forEach((_, ri) => {
        const y = PADDING_Y + ri * LINE_HEIGHT;
        context.fillStyle = "rgba(23, 33, 31, 0.28)";
        context.fillText(String(ri + 1).padStart(2, "0"), 18, y);
      });

      // Separator rule between gutter and code
      context.strokeStyle = "rgba(23, 33, 31, 0.09)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(GUTTER_WIDTH, 0);
      context.lineTo(GUTTER_WIDTH, h);
      context.stroke();

      // Draw code cells
      cells.forEach((cell) => {
        if (cell.delay > 0) {
          cell.delay = Math.max(0, cell.delay - delta);
        } else {
          cell.opacity += (cell.targetOpacity - cell.opacity) * 0.08;
        }

        const x = CODE_START_X + cell.col * CHAR_WIDTH;
        const y = PADDING_Y + cell.row * LINE_HEIGHT;

        const dist = Math.hypot(x - cx, y - cy);
        const proximity = Math.max(0, 1 - dist / CURSOR_INFLUENCE);
        const finalOpacity = Math.min(1, cell.opacity + proximity * 0.35);

        if (finalOpacity < 0.01) return;

        context.fillStyle = cell.isKeyword
          ? `rgba(13, 13, 13, ${finalOpacity})`
          : `rgba(45, 55, 52, ${finalOpacity * 0.88})`;

        context.fillText(cell.char, x, y);
      });

      // Blinking cursor caret
      const blinkOn = Math.floor(ts / 520) % 2 === 0;
      if (blinkOn && cells.length > 0) {
        const revealed = cells.filter((c) => c.opacity > 0.25);
        if (revealed.length > 0) {
          const last = revealed.reduce((a, b) =>
            b.row > a.row || (b.row === a.row && b.col > a.col) ? b : a,
          );
          const bx = CODE_START_X + (last.col + 1) * CHAR_WIDTH + 1;
          const by = PADDING_Y + last.row * LINE_HEIGHT;
          context.fillStyle = "rgba(13, 13, 13, 0.85)";
          context.fillRect(bx, by + 1, 1.5, FONT_SIZE);
        }
      }

      if (isVisible.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      const rect = containerEl.getBoundingClientRect();
      cursorRef.current.x = (e.clientX - rect.left) / rect.width;
      cursorRef.current.y = (e.clientY - rect.top) / rect.height;
      cursorRef.current.active = true;
    }
    function onPointerLeave() {
      cursorRef.current.active = false;
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerEl);

    const eventTarget =
      containerEl.closest<HTMLElement>(".hero") ??
      containerEl.parentElement ??
      containerEl;
    eventTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    eventTarget.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const viewportObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.current = entry.isIntersecting;
          if (entry.isIntersecting && !rafRef.current && !reducedMotion) {
            rafRef.current = requestAnimationFrame((ts) => {
              lastTs = ts;
              draw(ts);
            });
          } else if (!entry.isIntersecting && rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
          }
        });
      }
    );
    viewportObserver.observe(canvasRef.current);

    if (reducedMotion) {
      drawStatic();
    } else {
      rafRef.current = requestAnimationFrame((ts) => {
        lastTs = ts;
        rafRef.current = requestAnimationFrame(draw);
      });
    }

    return () => {
      resizeObserver.disconnect();
      viewportObserver.disconnect();
      cancelAnimationFrame(rafRef.current);
      eventTarget.removeEventListener("pointermove", onPointerMove);
      eventTarget.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reducedMotion]);

  return (
    <div className={`code-window-frame ${className}`}>
      {/* Sleek macOS / terminal style title bar */}
      <div className="code-window-header" aria-hidden="true">
        <div className="code-window-dots">
          <span className="dot dot-close" />
          <span className="dot dot-minimize" />
          <span className="dot dot-expand" />
        </div>
        <div className="code-window-tab">
          <span className="code-tab-icon">⚡</span>
          <span className="code-tab-title">{activeFile}</span>
        </div>
        <div className="code-window-badge">TypeScript</div>
      </div>

      {/* Main editor area with canvas */}
      <div ref={containerRef} className="code-canvas-wrap" aria-hidden="true">
        <canvas ref={canvasRef} className="code-canvas" />
        <span className="code-canvas-veil" />
      </div>
    </div>
  );
}
