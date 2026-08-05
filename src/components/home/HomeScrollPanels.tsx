"use client";

import React from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { FOUNDERS, TECHNICAL_TENETS, PROJECTS } from "../../data/studioData";
import { NUM_BAYS } from "./HomeCorridor";

const mono = "'JetBrains Mono', monospace";
const sans = "'Space Grotesk', sans-serif";
const INK   = "#0a0d14";
const BLUE  = "#2f7bff";
const BLUEB = "#5ea1ff";
const BLUED = "#1a4fa8";
const MID   = "#2a3a52";
const MUTED = "#6b7f99";
const TRIM  = "#dde4ef";

const TagPill: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:4,
    fontFamily:mono, fontSize:10, textTransform:"uppercase", letterSpacing:"0.08em",
    border:`1px solid ${BLUE}`, color:BLUED, background:"rgba(47,123,255,0.07)" }}>{label}</span>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontFamily:mono, fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase",
    color:BLUE, margin:"0 0 18px", display:"flex", alignItems:"center", gap:10 }}>
    <span style={{ display:"inline-block", width:24, height:1, background:BLUE }} />
    {children}
  </p>
);

const Rule: React.FC = () => (
  <div style={{ width:"100%", height:1, background:TRIM, margin:"20px 0" }} />
);

type PanelDef = { id:string; label:string; render:(p:{onContact:()=>void;onWork:()=>void})=>React.ReactNode; };

const PANELS: PanelDef[] = [
  // Bay 0 — Hero
  {
    id:"hero", label:"›_ systems, engineered.",
    render: ({ onContact, onWork }) => (
      <div>
        <Eyebrow>›_ systems, engineered.</Eyebrow>
        <h1 style={{ fontFamily:sans, fontWeight:900, color:INK,
          fontSize:"clamp(3rem,6vw,5.5rem)", lineHeight:1.0,
          letterSpacing:"-0.04em", margin:"0 0 28px" }}>
          WE BUILD<br />THE <span style={{color:BLUE}}>INFRA</span><span style={{color:BLUED}}>STRUCTURE</span><br />
          BEHIND<br /><span style={{fontStyle:"italic",color:BLUE}}>AI-NATIVE</span> PRODUCTS
        </h1>
        <Rule />
        <p style={{ fontFamily:sans, fontSize:17, lineHeight:1.72, color:MID, maxWidth:420, margin:"0 0 36px" }}>
          Custom WebGL, full-stack systems, and AI platforms engineered for scale —
          by two founders, zero account managers.
        </p>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button onClick={onContact} style={{
            padding:"13px 28px", borderRadius:8, border:"none", cursor:"pointer",
            fontFamily:sans, fontSize:14, fontWeight:700, color:"#fff",
            background:`linear-gradient(135deg,${BLUE},${BLUEB})`,
            boxShadow:"0 4px 24px rgba(47,123,255,0.35)", transition:"transform 0.15s,box-shadow 0.15s",
          }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="translateY(-2px)";el.style.boxShadow="0 8px 32px rgba(47,123,255,0.5)";}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="";el.style.boxShadow="0 4px 24px rgba(47,123,255,0.35)";}}
          >Book Discovery Call →</button>
          <button onClick={onWork} style={{
            padding:"13px 24px", borderRadius:8, cursor:"pointer",
            fontFamily:sans, fontSize:14, fontWeight:600, color:INK,
            background:"transparent", border:`1.5px solid ${TRIM}`, transition:"border-color 0.15s",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=BLUE;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=TRIM;}}
          >View Systems Built ↓</button>
        </div>
      </div>
    ),
  },

  // Bay 1 — Tenets
  {
    id:"tenets", label:"Core philosophy",
    render: () => (
      <div>
        <Eyebrow>01 — Core Philosophy</Eyebrow>
        <h2 style={{ fontFamily:sans, fontWeight:900, fontSize:"clamp(2rem,4vw,3.4rem)",
          color:INK, letterSpacing:"-0.03em", lineHeight:1.06, margin:"0 0 28px" }}>
          OUR ENGINEERING<br />TENETS
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px",
          border:`1px solid ${TRIM}`, background:TRIM }}>
          {TECHNICAL_TENETS.map(t => (
            <div key={t.number} style={{ background:"rgba(248,250,252,0.92)", padding:"22px 24px" }}>
              <div style={{ fontFamily:mono, fontSize:18, fontWeight:800, color:BLUE, marginBottom:8 }}>{t.number}</div>
              <div style={{ fontFamily:sans, fontWeight:700, fontSize:13, color:INK, marginBottom:6 }}>{t.title}</div>
              <p style={{ fontFamily:sans, fontSize:12, lineHeight:1.65, color:MID, margin:0 }}>{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Bays 2-4 — Projects (image lives on the 3D wall, no DOM image)
  ...PROJECTS.slice(0,3).map((proj,i) => ({
    id: proj.id, label:`Selected work — 0${i+1}`,
    render: () => (
      <div>
        <Eyebrow>0{i+2} — Selected Work · {proj.type} · {proj.year}</Eyebrow>
        <h2 style={{ fontFamily:sans, fontWeight:900,
          fontSize:"clamp(2.2rem,4.5vw,4rem)", color:INK,
          letterSpacing:"-0.04em", lineHeight:1.0, margin:"0 0 24px" }}>
          {proj.title.toUpperCase()}
        </h2>
        <p style={{ fontFamily:sans, fontSize:16, lineHeight:1.7, color:MID,
          maxWidth:"40ch", margin:"0 0 16px",
          display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical" as const, overflow:"hidden" }}>
          {proj.description}
        </p>
        {proj.metrics && (
          <div style={{ fontFamily:mono, fontSize:12, color:BLUED, marginBottom:20,
            display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ display:"inline-block", width:16, height:1, background:BLUE }} />
            {proj.metrics}
          </div>
        )}
        <Rule />
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {proj.tags.slice(0,5).map(tag => <TagPill key={tag} label={tag} />)}
        </div>
      </div>
    ),
  })) as PanelDef[],

  // Bay 5 — Founders
  {
    id:"founders", label:"The architects",
    render: () => (
      <div>
        <Eyebrow>06 — The Architects</Eyebrow>
        <h2 style={{ fontFamily:sans, fontWeight:900, fontSize:"clamp(2rem,3.8vw,3.2rem)",
          color:INK, letterSpacing:"-0.03em", lineHeight:1.06, margin:"0 0 28px" }}>
          MEET THE<br />FOUNDERS
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px",
          border:`1px solid ${TRIM}`, background:TRIM }}>
          {FOUNDERS.map(f => (
            <div key={f.id} style={{ background:"rgba(248,250,252,0.92)", padding:"24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <img src={f.avatar} alt={f.name} style={{ width:52, height:52, borderRadius:"50%",
                  objectFit:"cover", border:`2px solid ${BLUE}` }} />
                <div>
                  <div style={{ fontFamily:sans, fontWeight:800, fontSize:15, color:INK }}>{f.name}</div>
                  <div style={{ fontFamily:mono, fontSize:9, letterSpacing:"0.14em",
                    textTransform:"uppercase", color:BLUE, marginTop:3 }}>{f.role}</div>
                </div>
              </div>
              <Rule />
              <p style={{ fontFamily:sans, fontSize:12, lineHeight:1.65, color:MID, marginBottom:14 }}>{f.bio}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {f.specialties.slice(0,3).map(s => <TagPill key={s} label={s} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // Bay 6 — CTA
  {
    id:"cta", label:"Start a project",
    render: ({ onContact }) => (
      <div>
        <Eyebrow>07 — Ready to Build?</Eyebrow>
        <h2 style={{ fontFamily:sans, fontWeight:900,
          fontSize:"clamp(2.4rem,4.5vw,4rem)", color:INK,
          letterSpacing:"-0.04em", lineHeight:1.02, margin:"0 0 20px" }}>
          LET'S BUILD<br /><span style={{color:BLUE}}>THE NEXT</span><br />SYSTEM.
        </h2>
        <Rule />
        <p style={{ fontFamily:sans, fontSize:16, lineHeight:1.72, color:MID,
          maxWidth:"38ch", margin:"0 0 28px" }}>
          Open for freelance and studio collaborations. Direct access to the founders —
          no account managers, no junior handoffs.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"flex-start", marginBottom:32 }}>
          <button onClick={onContact} style={{
            padding:"15px 32px", borderRadius:8, border:"none", cursor:"pointer",
            fontFamily:sans, fontSize:15, fontWeight:700, color:"#fff",
            background:`linear-gradient(135deg,${BLUE},${BLUEB})`,
            boxShadow:"0 6px 28px rgba(47,123,255,0.40)", transition:"transform 0.15s",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="";}}
          >Book Discovery Call →</button>
          <span style={{ fontFamily:mono, fontSize:11, color:MUTED }}>studio@bytebrothers.dev</span>
        </div>
        <div style={{ borderTop:`1px solid ${TRIM}` }}>
          {[["Availability","Q3 / Q4 2025"],["Response Time","< 24 hours"],["Min. Engagement","$5K"],["Onboarding","1-week sprint"]].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"11px 0", borderBottom:`1px solid ${TRIM}` }}>
              <span style={{ fontFamily:mono, fontSize:11, color:MUTED, letterSpacing:"0.05em" }}>{l}</span>
              <span style={{ display:"flex", alignItems:"center", gap:7, fontFamily:sans, fontWeight:700, fontSize:13, color:INK }}>
                <span style={{ width:6, height:6, borderRadius:"50%", display:"inline-block",
                  background:"#22c55e", boxShadow:"0 0 8px #22c55e" }} />
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

interface HomeScrollPanelsProps { onContact:()=>void; onWork:()=>void; }

export const HomeScrollPanels: React.FC<HomeScrollPanelsProps> = ({ onContact, onWork }) => {
  const scrollProgress = useScrollProgress();
  const band = 1 / NUM_BAYS;

  const opacities = PANELS.map((_,i) => {
    const centre = band * i + band / 2;
    const eff = i===0 ? Math.max(scrollProgress,centre) : i===PANELS.length-1 ? Math.min(scrollProgress,centre) : scrollProgress;
    const dist = Math.abs(eff - centre);
    return Math.max(0, 1 - dist / (band * 0.52));
  });

  const activeBay = opacities.reduce((best,op,i) => op > opacities[best] ? i : best, 0);

  return (
    <div style={{ position:"relative", zIndex:2, pointerEvents:"none" }}>
      <div id="scroll-track" style={{ height:`${NUM_BAYS * 120}vh` }} />

      {PANELS.map((panel,i) => (
        <div key={panel.id} style={{
          position:"fixed", inset:0,
          display:"flex", alignItems:"center",
          paddingLeft:"clamp(40px,7vw,100px)",
          paddingRight:"50vw",
          paddingTop:"80px",
          opacity:opacities[i], zIndex:2, pointerEvents:"none",
          transition:"opacity 0.2s ease",
        }}>
          <div style={{ pointerEvents:"auto", width:"100%" }}>
            {panel.render({ onContact, onWork })}
          </div>
        </div>
      ))}

      {/* HUD */}
      <div style={{ position:"fixed", bottom:"1.8rem", left:"clamp(40px,7vw,100px)", zIndex:3,
        display:"flex", alignItems:"center", gap:12,
        fontFamily:mono, fontSize:10, letterSpacing:"0.15em",
        textTransform:"uppercase", color:MUTED, pointerEvents:"none" }}>
        <span style={{ color:BLUE, fontWeight:700 }}>{String(activeBay+1).padStart(2,"0")}</span>
        <span>/ {String(NUM_BAYS).padStart(2,"0")}</span>
        <div style={{ width:90, height:1, background:TRIM, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", left:0, top:0, height:"100%",
            width:`${scrollProgress*100}%`, background:BLUE, transition:"width 0.12s linear" }} />
        </div>
        <span style={{ fontSize:9, color:MUTED }}>{PANELS[activeBay]?.label}</span>
      </div>

      {/* Scroll cue */}
      <div style={{ position:"fixed", top:"5.5rem", right:"clamp(32px,6vw,80px)", zIndex:3,
        fontFamily:mono, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase",
        color:MUTED, pointerEvents:"none",
        opacity:scrollProgress < 0.02 ? 1 : 0, transition:"opacity 0.5s ease" }}>
        Scroll to walk in ↓
      </div>
    </div>
  );
};

export default HomeScrollPanels;
