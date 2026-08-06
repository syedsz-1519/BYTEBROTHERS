"use client";

/**
 * EntranceDoor.tsx
 *
 * Light Warm Wooden Entrance Cinematic.
 *  - Warm natural wood/bronze glass double doors
 *  - Warm amber LED edge lighting
 *  - Waving & door-pushing developer silhouettes
 *  - Warm amber light spill emerging from the office inside
 */

import React, { useEffect, useRef } from "react";

const STYLE_ID = "entrance-door-keyframes-v3";

function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes doorSwingLeft {
      0%   { transform: perspective(1000px) rotateY(0deg); }
      100% { transform: perspective(1000px) rotateY(-78deg); }
    }
    @keyframes doorSwingRight {
      0%   { transform: perspective(1000px) rotateY(0deg); }
      100% { transform: perspective(1000px) rotateY(78deg); }
    }
    @keyframes spillGlow {
      0%   { opacity: 0; width: 0px; }
      40%  { opacity: 0.75; }
      100% { opacity: 1; width: 280px; }
    }
    @keyframes brandFadeIn {
      0%   { opacity: 0; letter-spacing: 0.5em; transform: translateX(-50%) translateY(10px); }
      100% { opacity: 1; letter-spacing: 0.28em; transform: translateX(-50%) translateY(0); }
    }
    @keyframes overlayFadeOut {
      0%   { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes warmGlowPulse {
      0%, 100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }
      50%       { box-shadow: 0 0 28px rgba(245, 158, 11, 0.7); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Left Silhouette (Hoodie Developer pushing door open) ────────────────────

function SilhouetteLeftSVG() {
  return (
    <svg viewBox="0 0 140 280" width={110} height={220} style={{ filter: "drop-shadow(0 0 12px rgba(0,0,0,0.6))" }}>
      <path d="M 65 30 C 50 30, 45 45, 45 60 C 45 75, 55 85, 70 85 C 85 85, 95 75, 95 60 C 95 45, 80 30, 65 30 Z" fill="#1c1917" />
      <path d="M 35 90 C 25 120, 20 180, 25 210 L 85 210 C 90 180, 85 120, 75 90 Z" fill="#1c1917" />
      <path d="M 65 100 L 115 130 L 130 145" stroke="#1c1917" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 40 100 L 25 150" stroke="#1c1917" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M 40 205 L 20 270" stroke="#0c0a09" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 70 205 L 75 270" stroke="#0c0a09" strokeWidth="18" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Right Silhouette (Developer flat hands against glass) ───────────────────

function SilhouetteRightSVG() {
  return (
    <svg viewBox="0 0 140 280" width={110} height={220} style={{ filter: "drop-shadow(0 0 12px rgba(0,0,0,0.6))" }}>
      <circle cx="70" cy="50" r="22" fill="#1c1917" />
      <path d="M 30 90 L 110 90 L 95 210 L 45 210 Z" fill="#1c1917" />
      <path d="M 35 95 L 15 50 L 15 35" stroke="#1c1917" strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="15" cy="28" r="10" fill="#1c1917" />
      <path d="M 105 95 L 125 50 L 125 35" stroke="#1c1917" strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="125" cy="28" r="10" fill="#1c1917" />
      <path d="M 50 205 L 45 270" stroke="#0c0a09" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 85 205 L 90 270" stroke="#0c0a09" strokeWidth="18" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Glass Door Panel Component ──────────────────────────────────────────────

function GlassDoorPanel({ side }: { side: "left" | "right" }) {
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
        animation: `${isLeft ? "doorSwingLeft" : "doorSwingRight"} 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards`,
        transformStyle: "preserve-3d",
        background: "rgba(254, 243, 199, 0.15)",
        backdropFilter: "blur(4px)",
        border: "3px solid rgba(217, 119, 6, 0.5)",
        boxShadow: "inset 0 0 20px rgba(245, 158, 11, 0.2), 0 0 25px rgba(0,0,0,0.5)",
        zIndex: 20,
        overflow: "hidden",
      }}
    >
      {/* Warm Amber LED border glow strip along inner vertical edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          [isLeft ? "right" : "left"]: 0,
          width: 4,
          height: "100%",
          background: "#f59e0b",
          boxShadow: "0 0 16px #f59e0b",
        }}
      />

      {/* Etched Glass "BYTEBROTHERS" Text */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(12px, 1.8vw, 18px)",
          fontWeight: 800,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(120, 53, 15, 0.85)",
          textShadow: "0 0 8px rgba(254, 243, 199, 0.8)",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {isLeft ? "BYTE" : "BROTHERS"}
      </div>

      {/* Door Handle bar */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          [isLeft ? "right" : "left"]: 16,
          width: 8,
          height: 120,
          borderRadius: 4,
          background: "linear-gradient(180deg, #d97706, #78350f)",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      />
    </div>
  );
}

// ─── EntranceDoor Main Component ──────────────────────────────────────────────

export interface EntranceDoorProps {
  onDone: () => void;
}

export const EntranceDoor: React.FC<EntranceDoorProps> = ({ onDone }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectKeyframes();

    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 50%, #442d1d 0%, #261910 70%, #170f0a 100%)",
        animation: "overlayFadeOut 0.45s ease-in 2.35s forwards",
      }}
    >
      {/* Outer Warm Wood Frame */}
      <div
        style={{
          position: "relative",
          width: "min(680px, 85vw)",
          height: "82vh",
          border: "12px solid #78350f",
          borderRadius: 4,
          boxShadow: "0 0 80px rgba(0,0,0,0.7), inset 0 0 50px rgba(0,0,0,0.6)",
          overflow: "hidden",
          background: "#fdfbf7",
        }}
      >
        {/* Warm LED border glow along outer frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "2px solid rgba(245, 158, 11, 0.5)",
            animation: "warmGlowPulse 2s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 15,
          }}
        />

        {/* Interior Office Amber Spill Light */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            height: "100%",
            width: 0,
            background:
              "radial-gradient(ellipse 100% 120% at 50% 50%, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0.15) 60%, transparent 100%)",
            animation: "spillGlow 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards",
            zIndex: 8,
            pointerEvents: "none",
          }}
        />

        {/* Glass Double Doors */}
        <GlassDoorPanel side="left" />
        <GlassDoorPanel side="right" />

        {/* Left Developer Silhouette */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: "14%",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <SilhouetteLeftSVG />
        </div>

        {/* Right Developer Silhouette */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "14%",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <SilhouetteRightSVG />
        </div>

        {/* Reveal Brand Title inside gap */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
            opacity: 0,
            animation: "brandFadeIn 0.5s ease-out 1.6s forwards",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(16px, 2.5vw, 26px)",
              fontWeight: 900,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#d97706",
              textShadow: "0 0 20px rgba(245, 158, 11, 0.6)",
            }}
          >
            WELCOME TO BYTEBROTHERS
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntranceDoor;
