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
