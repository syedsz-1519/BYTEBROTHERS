"use client";

/**
 * EntranceDoor.tsx
 *
 * Full-screen entrance cinematic overlay.
 *
 * Sequence (total ≈ 1.5 s):
 *  0.0s — overlay visible, doors closed, both silhouettes idle
 *  0.2s — left door begins swinging open (CSS perspective rotateY)
 *  0.2s — right door begins swinging open
 *  0.7s — doors 80% open, amber spill light fills the gap
 *  0.8s — left silhouette arm waves (keyframe)
 *  1.1s — "BYTEBROTHERS" text fades in over the gap
 *  1.4s — whole overlay fades out
 *  1.6s — onDone() fires, overlay removed from DOM
 */

import React, { useEffect, useRef } from "react";

// ─── Keyframe CSS (injected once) ────────────────────────────────────────────

const STYLE_ID = "entrance-door-keyframes";

function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes doorSwingLeft {
      0%   { transform: perspective(800px) rotateY(0deg); }
      100% { transform: perspective(800px) rotateY(-85deg); }
    }
    @keyframes doorSwingRight {
      0%   { transform: perspective(800px) rotateY(0deg); }
      100% { transform: perspective(800px) rotateY(85deg); }
    }
    @keyframes silhouetteWave {
      0%   { transform: rotate(0deg); }
      25%  { transform: rotate(-28deg); }
      55%  { transform: rotate(12deg); }
      80%  { transform: rotate(-18deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes spillGlow {
      0%   { opacity: 0; width: 0px; }
      40%  { opacity: 0.6; }
      100% { opacity: 1; width: 220px; }
    }
    @keyframes brandFadeIn {
      0%   { opacity: 0; letter-spacing: 0.6em; }
      100% { opacity: 1; letter-spacing: 0.22em; }
    }
    @keyframes overlayFadeOut {
      0%   { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes ambientPulse {
      0%, 100% { opacity: 0.7; }
      50%       { opacity: 1; }
    }
    @keyframes particleDrift {
      0%   { transform: translateY(0)   translateX(0)   opacity(0.0); opacity: 0; }
      20%  { opacity: 0.6; }
      80%  { opacity: 0.4; }
      100% { transform: translateY(-60px) translateX(14px) opacity(0.0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Particle (ambient floating code chars) ──────────────────────────────────

const CODE_CHARS = ["</>", "{}", "=>", "&&", "01", "//", "fn", "AI"];

function Particle({ x, delay, char }: { x: number; delay: number; char: string }) {
  return (
    <span
      style={{
        position: "absolute",
        left: `${x}%`,
        bottom: "12%",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: "#f59e0b",
        opacity: 0,
        animation: `particleDrift ${1.8 + Math.random() * 0.8}s ease-in ${delay}s forwards`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {char}
    </span>
  );
}

// ─── Developer silhouette SVG ─────────────────────────────────────────────────

/**
 * A simple SVG silhouette of a standing person.
 * `wave` — enables the arm wave keyframe animation.
 * `flip` — mirrors the figure (for the right side).
 */
function SilhouetteSVG({ wave, flip }: { wave: boolean; flip: boolean }) {
  const armStyle: React.CSSProperties = wave
    ? {
        transformOrigin: "18px 22px",
        animation: "silhouetteWave 0.55s ease-in-out 0.8s 1",
      }
    : {};

  return (
    <svg
      viewBox="0 0 36 100"
      width={52}
      height={140}
      style={{
        transform: flip ? "scaleX(-1)" : "none",
        filter: "drop-shadow(0 0 18px rgba(245,158,11,0.25))",
      }}
    >
      {/* Head */}
      <circle cx="18" cy="9" r="8" fill="#1a1008" />
      {/* Body */}
      <rect x="10" y="18" width="16" height="28" rx="4" fill="#1a1008" />
      {/* Left arm — this is the waving arm */}
      <g style={armStyle}>
        <rect x="0" y="22" width="10" height="5" rx="2.5" fill="#1a1008" />
        {/* Hand */}
        <circle cx="0" cy="24.5" r="3" fill="#1a1008" />
      </g>
      {/* Right arm */}
      <rect x="26" y="22" width="10" height="5" rx="2.5" fill="#1a1008" />
      {/* Left leg */}
      <rect x="11" y="46" width="6" height="30" rx="3" fill="#1a1008" />
      {/* Right leg */}
      <rect x="19" y="46" width="6" height="30" rx="3" fill="#1a1008" />
      {/* Shoes */}
      <ellipse cx="14" cy="76" rx="7" ry="3.5" fill="#0d0804" />
      <ellipse cx="22" cy="76" rx="7" ry="3.5" fill="#0d0804" />
    </svg>
  );
}

// ─── DoorPanel ────────────────────────────────────────────────────────────────

function DoorPanel({
  side,
  animDelay,
}: {
  side: "left" | "right";
  animDelay: number;
}) {
  const isLeft = side === "left";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        [isLeft ? "left" : "right"]: 0,
        width: "50%",
        height: "100%",
        transformOrigin: isLeft ? "left center" : "right center",
        animation: `${isLeft ? "doorSwingLeft" : "doorSwingRight"} 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s forwards`,
        transformStyle: "preserve-3d",
        backgroundImage: `
          linear-gradient(
            ${isLeft ? "90deg" : "270deg"},
            #1c120a 0%,
            #2a1d0e 60%,
            #3a280f 100%
          )
        `,
        boxShadow: isLeft
          ? "inset -4px 0 16px rgba(0,0,0,0.6), 6px 0 24px rgba(0,0,0,0.8)"
          : "inset 4px 0 16px rgba(0,0,0,0.6), -6px 0 24px rgba(0,0,0,0.8)",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      {/* Door panel inset lines — wood grain effect */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "10%",
          right: "10%",
          height: "35%",
          border: "2px solid rgba(245,158,11,0.15)",
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "10%",
          right: "10%",
          height: "32%",
          border: "2px solid rgba(245,158,11,0.15)",
          borderRadius: 4,
        }}
      />
      {/* Frosted glass strip with "BYTEBROTHERS" text */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "4%",
          right: "4%",
          height: 32,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(245,158,11,0.55)",
            whiteSpace: "nowrap",
          }}
        >
          {isLeft ? "BYTE" : "BROTHERS"}
        </span>
      </div>

      {/* LED strip along hinge edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          [isLeft ? "right" : "left"]: 0,
          width: 3,
          height: "100%",
          background:
            "linear-gradient(180deg, #f59e0b 0%, #f59e0b80 50%, #f59e0b 100%)",
          animation: "ambientPulse 2s ease-in-out infinite",
          boxShadow: "0 0 12px #f59e0b, 0 0 24px #f59e0b60",
        }}
      />

      {/* Door handle */}
      <div
        style={{
          position: "absolute",
          top: "47%",
          [isLeft ? "right" : "left"]: "8%",
          width: 6,
          height: 28,
          borderRadius: 3,
          background: "linear-gradient(180deg, #c9a96e, #8b6914)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

// ─── EntranceDoor (exported component) ───────────────────────────────────────

interface EntranceDoorProps {
  /** Called when the full animation completes and overlay should be removed. */
  onDone: () => void;
}

/**
 * Full-screen entrance cinematic.
 * Renders over the Three.js canvas, plays once, then calls onDone.
 * Parent is responsible for unmounting after onDone fires.
 */
export const EntranceDoor: React.FC<EntranceDoorProps> = ({ onDone }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectKeyframes();

    // Fire onDone after full cinematic door animation completes (2.8s)
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  // Generate a small set of ambient particles
  const particles = CODE_CHARS.map((char, i) => (
    <Particle
      key={char}
      char={char}
      x={32 + i * 4.5}
      delay={0.8 + i * 0.1}
    />
  ));

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0d0804 0%, #1a100a 60%, #0a0604 100%)",
        animation: "overlayFadeOut 0.45s ease-in 2.35s forwards",
      }}
    >
      {/* === Door Frame (structural outer box) === */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(440px, 60vw)",
          height: "84%",
          border: "6px solid #3a250d",
          borderRadius: "4px 4px 0 0",
          boxShadow: "0 0 60px rgba(245,158,11,0.12), inset 0 0 40px rgba(0,0,0,0.5)",
          zIndex: 10,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #1c1208 0%, #251808 100%)",
        }}
      >
        {/* Interior glow (visible as doors open) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 70% at 50% 60%, #f59e0b22 0%, transparent 80%)",
            animation: "ambientPulse 2.5s ease-in-out 0.3s infinite",
            zIndex: 8,
          }}
        />

        {/* Left door panel */}
        <DoorPanel side="left" animDelay={0.3} />

        {/* Right door panel */}
        <DoorPanel side="right" animDelay={0.3} />

        {/* Amber light spill — grows smoothly as doors open */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            height: "100%",
            width: 0,
            background:
              "radial-gradient(ellipse 100% 120% at 50% 50%, #f59e0b40 0%, #c9720810 60%, transparent 100%)",
            animation: "spillGlow 1.6s cubic-bezier(0.16,1,0.3,1) 0.4s forwards",
            zIndex: 9,
            pointerEvents: "none",
          }}
        />

        {/* Brand text in the spill gap */}
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
            opacity: 0,
            animation: "brandFadeIn 0.5s ease-out 1.7s forwards",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#f59e0b",
              textShadow: "0 0 20px #f59e0b, 0 0 40px #f59e0b60",
            }}
          >
            BYTEBROTHERS
          </span>
        </div>

        {/* Ambient particles floating through gap */}
        {particles}
      </div>

      {/* === Left Silhouette === */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          left: "50%",
          transform: "translateX(calc(-50% - min(200px, 26vw)))",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SilhouetteSVG wave={true} flip={false} />
        {/* subtle amber backlit glow under feet */}
        <div
          style={{
            width: 48,
            height: 10,
            background: "radial-gradient(ellipse at 50% 100%, #f59e0b30, transparent 70%)",
            marginTop: -4,
          }}
        />
      </div>

      {/* === Right Silhouette === */}
      <div
        style={{
          position: "absolute",
          bottom: "14%",
          left: "50%",
          transform: "translateX(calc(-50% + min(200px, 26vw)))",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SilhouetteSVG wave={false} flip={true} />
        <div
          style={{
            width: 48,
            height: 10,
            background: "radial-gradient(ellipse at 50% 100%, #f59e0b30, transparent 70%)",
            marginTop: -4,
          }}
        />
      </div>

      {/* === Floor reflection strip === */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "14%",
          background:
            "linear-gradient(180deg, transparent 0%, #0d0804 60%, #080503 100%)",
          zIndex: 5,
        }}
      />

      {/* === Ceiling vignette === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8%",
          background: "linear-gradient(180deg, #060300 0%, transparent 100%)",
          zIndex: 5,
        }}
      />

      {/* === BYTEBROTHERS exterior sign above door === */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(9px, 1.4vw, 14px)",
          fontWeight: 700,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(245,158,11,0.5)",
          textShadow: "0 0 12px rgba(245,158,11,0.3)",
          whiteSpace: "nowrap",
          zIndex: 40,
          animation: "ambientPulse 3s ease-in-out infinite",
        }}
      >
        ›_ BYTEBROTHERS · TECH STUDIO
      </div>
    </div>
  );
};

export default EntranceDoor;
