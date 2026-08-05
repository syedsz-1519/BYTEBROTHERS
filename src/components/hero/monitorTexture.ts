import * as THREE from "three";

const CYAN = "#00f0ff";
const BG = "#0d1117";
const SIDEBAR = "#010409";
const PANEL = "#161b22";
const BORDER = "#21262d";
const TEXT = "#8b949e";
const TEXT_BRIGHT = "#c9d1d9";

const ARCH_LOGS = [
  "[core] ByteBrothers AI Core Engine v2.0 — online",
  "[arch] Mounting WebGL render pipeline...",
  "[arch] Hydrating React Three Fiber scene graph",
  "[sys]  Shader nodes compiled — 128 pass OK",
  "[net]  Edge CDN cache warmed — 42ms",
  "[ai]   Inference queue ready — batch=16",
  "[db]   Postgres connection pool: 12/12",
  "[perf] Lighthouse score target: 98+",
  "[3d]   GLTF mesh batching enabled",
  "[sec]  TLS 1.3 handshake verified",
  "[dev]  Hot reload channel active",
  "[ops]  Deploy pipeline: staging → prod",
];

export function createMonitorCanvasTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1152;

  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const matrixChars = "01アイウエオカキクケコサシスセソタチツテト";
  const columns = 28;
  const drops: number[] = Array.from({ length: columns }, () => Math.random() * -40);

  let logOffset = 0;

  const draw = (time: number) => {
    const w = canvas.width;
    const h = canvas.height;
    const sidebarW = w * 0.18;
    const titleH = 44;
    const terminalH = h * 0.28;
    const editorH = h - titleH - terminalH;

    // Title bar
    ctx.fillStyle = SIDEBAR;
    ctx.fillRect(0, 0, w, titleH);
    ctx.fillStyle = BORDER;
    ctx.fillRect(0, titleH - 1, w, 1);

    // Window controls
    const dotY = titleH / 2;
    ["#ff5f57", "#febc2e", "#28c840"].forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(20 + i * 18, dotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    ctx.font = "600 22px 'Consolas', 'Courier New', monospace";
    ctx.fillStyle = TEXT_BRIGHT;
    ctx.textAlign = "center";
    ctx.fillText("ByteBrothers AI Core Engine v2.0", w / 2, dotY + 8);
    ctx.textAlign = "left";

    // Sidebar
    ctx.fillStyle = SIDEBAR;
    ctx.fillRect(0, titleH, sidebarW, h - titleH);
    ctx.fillStyle = BORDER;
    ctx.fillRect(sidebarW - 1, titleH, 1, h - titleH);

    ctx.font = "18px 'Consolas', 'Courier New', monospace";
    ctx.fillStyle = TEXT;
    ctx.fillText("EXPLORER", 16, titleH + 32);

    const tree = ["▾ core-engine", "  ├ renderer.ts", "  ├ scene.graph", "  ├ shaders/", "  └ deploy.yml"];
    tree.forEach((line, i) => {
      ctx.fillStyle = i === 0 ? CYAN : TEXT;
      ctx.fillText(line, 20, titleH + 64 + i * 28);
    });

    // Editor panel background
    ctx.fillStyle = BG;
    ctx.fillRect(sidebarW, titleH, w - sidebarW, editorH);

    // Matrix rain (editor background)
    ctx.save();
    ctx.beginPath();
    ctx.rect(sidebarW, titleH, w - sidebarW, editorH);
    ctx.clip();
    ctx.font = "16px 'Consolas', monospace";
    const colW = (w - sidebarW) / columns;
    drops.forEach((drop, i) => {
      const x = sidebarW + i * colW;
      const y = titleH + drop * 18;
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillStyle = `rgba(0, 240, 255, ${0.08 + Math.random() * 0.12})`;
      ctx.fillText(char, x, y);
      if (y > titleH + editorH) drops[i] = 0;
      drops[i] += 0.35 + Math.random() * 0.25;
    });
    ctx.restore();

    // Code snippet overlay
    ctx.font = "22px 'Consolas', 'Courier New', monospace";
    const codeLines = [
      { text: "import { Engine } from '@bytebrothers/core';", color: TEXT_BRIGHT },
      { text: "const engine = Engine.create({", color: TEXT_BRIGHT },
      { text: "  version: '2.0',", color: CYAN },
      { text: "  render: 'webgl2',", color: "#79c0ff" },
      { text: "  ai: { inference: true },", color: "#79c0ff" },
      { text: "});", color: TEXT_BRIGHT },
      { text: "await engine.boot(); // ✓ ready", color: "#3fb950" },
    ];
    codeLines.forEach((line, i) => {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, sidebarW + 32, titleH + 56 + i * 34);
    });

    // Glowing WebGL nodes
    const nodes = [
      { x: sidebarW + w * 0.55, y: titleH + editorH * 0.35, r: 6 },
      { x: sidebarW + w * 0.68, y: titleH + editorH * 0.55, r: 5 },
      { x: sidebarW + w * 0.78, y: titleH + editorH * 0.25, r: 4 },
    ];
    nodes.forEach((node, i) => {
      const pulse = 0.5 + 0.5 * Math.sin(time * 2 + i);
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${0.08 * pulse})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = CYAN;
      ctx.fill();
    });

    // Terminal panel
    const termY = titleH + editorH;
    ctx.fillStyle = PANEL;
    ctx.fillRect(0, termY, w, terminalH);
    ctx.fillStyle = BORDER;
    ctx.fillRect(0, termY, w, 1);

    ctx.font = "600 18px 'Consolas', monospace";
    ctx.fillStyle = TEXT;
    ctx.fillText("TERMINAL — architecture logs", 16, termY + 28);

    ctx.font = "20px 'Consolas', 'Courier New', monospace";
    const scrollSpeed = 0.015;
    logOffset = (logOffset + scrollSpeed) % ARCH_LOGS.length;

    for (let i = 0; i < 7; i++) {
      const idx = Math.floor(logOffset + i) % ARCH_LOGS.length;
      const log = ARCH_LOGS[idx];
      const alpha = i === 0 ? 0.5 : 0.35 + (7 - i) * 0.08;
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fillText(log, 24, termY + 60 + i * 30);
    }

    texture.needsUpdate = true;
  };

  draw(0);

  return { texture, draw };
}

// ─── createMonitorTexture ─────────────────────────────────────────────────────

/**
 * Describes the visual style of content to render on a monitor canvas.
 */
export interface MonitorContent {
  /** Visual mode for the monitor. */
  type: "code" | "terminal" | "matrix";
  /** Optional hint for code-type monitors (e.g. 'typescript'). Currently unused
   *  but reserved for future syntax-highlight colouring. */
  language?: string;
  /** Optional lines of text to display. Falls back to built-in defaults. */
  lines?: string[];
}

/**
 * A live handle to an animated canvas texture.
 * Callers must call `draw(time)` each frame and `dispose()` on unmount.
 */
export interface CanvasTextureHandle {
  /** The Three.js texture backed by the canvas. */
  texture: THREE.CanvasTexture;
  /**
   * Update the canvas contents for the current frame.
   * Sets `texture.needsUpdate = true` internally.
   * @param time - Elapsed time in seconds (from Three.js clock or useFrame).
   */
  draw: (time: number) => void;
  /**
   * Dispose the texture and null all internal references.
   * Must be called when the owning component unmounts.
   */
  dispose: () => void;
}

// ── Default content ───────────────────────────────────────────────────────────

const DEFAULT_CODE_LINES = [
  "import { Engine } from '@bytebrothers/core';",
  "const engine = Engine.create({",
  "  version: '2.0',",
  "  render: 'webgl2',",
  "  ai: { inference: true },",
  "});",
  "await engine.boot(); // ✓ ready",
];

const DEFAULT_TERMINAL_LINES = [
  "$ npm run build",
  "> vite build",
  "✓ 128 modules transformed.",
  "dist/index.html          1.2 kB",
  "dist/assets/index.js   342.1 kB",
  "✓ built in 1.42s",
  "$ git push origin main",
  "> Enumerating objects: 12, done.",
  "> Writing objects: 100% (12/12)",
  "To github.com:bytebrothers/core.git",
  "   f3a2c1d..9b8e7a4  main -> main",
];

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテト";

// ── Type-specific draw factories ──────────────────────────────────────────────

function makeCodeDraw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  lines: string[],
) {
  const drops: number[] = Array.from({ length: 20 }, () => Math.random() * -40);

  return (time: number) => {
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, w, h);

    // Title bar
    ctx.fillStyle = "#010409";
    ctx.fillRect(0, 0, w, 40);
    ctx.fillStyle = "#21262d";
    ctx.fillRect(0, 39, w, 1);

    // Window dots
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(18 + i * 18, 20, 6, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });

    ctx.font = "600 18px 'Consolas', monospace";
    ctx.fillStyle = "#c9d1d9";
    ctx.textAlign = "center";
    ctx.fillText("editor.ts", w / 2, 26);
    ctx.textAlign = "left";

    // Subtle matrix rain in background
    ctx.save();
    ctx.font = "14px 'Consolas', monospace";
    const colW = w / drops.length;
    drops.forEach((drop, i) => {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      ctx.fillStyle = `rgba(0, 240, 255, ${0.05 + Math.random() * 0.07})`;
      ctx.fillText(char, i * colW, 50 + drop * 16);
      if (50 + drop * 16 > h) drops[i] = 0;
      drops[i] += 0.4 + Math.random() * 0.3;
    });
    ctx.restore();

    // Code lines
    const colours = ["#c9d1d9", "#00f0ff", "#79c0ff", "#3fb950", "#f0883e"];
    ctx.font = "20px 'Consolas', monospace";
    lines.forEach((line, i) => {
      ctx.fillStyle = colours[i % colours.length];
      ctx.fillText(line, 24, 80 + i * 32);
    });

    // Pulsing cursor
    const cursorOn = Math.floor(time * 2) % 2 === 0;
    if (cursorOn) {
      const lastLine = lines[lines.length - 1] ?? "";
      const metrics = ctx.measureText(lastLine);
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(24 + metrics.width + 3, 80 + (lines.length - 1) * 32 - 18, 2, 20);
    }

    texture.needsUpdate = true;
  };
}

function makeTerminalDraw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  lines: string[],
) {
  let logOffset = 0;

  return (time: number) => {
    const w = canvas.width;
    const h = canvas.height;

    // Dark terminal background
    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, w, h);

    // Title bar
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, w, 36);
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 35, w, 1);

    ctx.font = "600 16px 'Consolas', monospace";
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.fillText("terminal", w / 2, 24);
    ctx.textAlign = "left";

    // Prompt header
    ctx.font = "18px 'Consolas', monospace";
    ctx.fillStyle = "#3fb950";
    ctx.fillText("bytebrothers@dev:~$", 16, 64);

    // Scrolling log lines
    const visibleCount = Math.min(14, Math.floor((h - 80) / 30));
    logOffset += 0.008;
    for (let i = 0; i < visibleCount; i++) {
      const idx = Math.floor(logOffset + i) % lines.length;
      const line = lines[idx];
      const alpha = 0.3 + ((visibleCount - i) / visibleCount) * 0.7;
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fillText(line, 16, 90 + i * 30);
    }

    // Blinking cursor at bottom
    const cursorOn = Math.floor(time * 2) % 2 === 0;
    ctx.fillStyle = cursorOn ? "#3fb950" : "transparent";
    ctx.fillText("_", 16, 90 + visibleCount * 30);

    texture.needsUpdate = true;
  };
}

function makeMatrixDraw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
) {
  const columns = 40;
  const drops: number[] = Array.from({ length: columns }, () => Math.random() * -60);
  const speeds: number[] = Array.from({ length: columns }, () => 0.3 + Math.random() * 0.5);

  return (_time: number) => {
    const w = canvas.width;
    const h = canvas.height;

    // Translucent overlay creates the trailing fade effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = "16px 'Consolas', monospace";
    const colW = w / columns;

    drops.forEach((drop, i) => {
      const x = i * colW;
      const y = drop * 18;

      // Bright leading character
      ctx.fillStyle = "#ffffff";
      const leadChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      ctx.fillText(leadChar, x, y);

      // Trailing green characters
      for (let k = 1; k < 8; k++) {
        const trailY = y - k * 18;
        if (trailY < 0) continue;
        const alpha = (8 - k) / 8;
        ctx.fillStyle = `rgba(0, 240, 80, ${alpha * 0.9})`;
        const trailChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(trailChar, x, trailY);
      }

      if (y > h + 18) drops[i] = 0;
      drops[i] += speeds[i];
    });

    texture.needsUpdate = true;
  };
}

// ── Public factory ────────────────────────────────────────────────────────────

/**
 * Create an animated canvas texture for a monitor screen.
 *
 * Preconditions:
 *   - `content.type` is one of `'code'`, `'terminal'`, or `'matrix'`
 *   - Must be called in a browser context where `document.createElement` exists
 *
 * Postconditions:
 *   - Returns a `CanvasTextureHandle` with a live `THREE.CanvasTexture`
 *   - `draw(time)` updates the canvas and sets `texture.needsUpdate = true`
 *   - `dispose()` disposes the texture and nulls all internal references
 *
 * @param content - Descriptor for the monitor content style.
 * @returns A `CanvasTextureHandle`.
 */
export function createMonitorTexture(content: MonitorContent): CanvasTextureHandle {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;

  const ctx = canvas.getContext("2d")!;

  let texture: THREE.CanvasTexture | null = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const lines = content.lines ?? (
    content.type === "terminal" ? DEFAULT_TERMINAL_LINES : DEFAULT_CODE_LINES
  );

  // Build the type-specific draw function
  let drawFn: ((time: number) => void) | null;
  if (content.type === "terminal") {
    drawFn = makeTerminalDraw(canvas, ctx, texture, lines);
  } else if (content.type === "matrix") {
    drawFn = makeMatrixDraw(canvas, ctx, texture);
  } else {
    // 'code' (default)
    drawFn = makeCodeDraw(canvas, ctx, texture, lines);
  }

  // Render an initial frame immediately
  drawFn(0);

  const draw = (time: number) => {
    if (!drawFn || !texture) return;
    drawFn(time);
    // drawFn already sets needsUpdate — this is a belt-and-suspenders guarantee
    texture.needsUpdate = true;
  };

  const dispose = () => {
    texture?.dispose();
    texture = null;
    drawFn = null;
  };

  return { texture: texture!, draw, dispose };
}
