import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Workflow, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Code, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Check, 
  Play, 
  Terminal,
  Zap,
  TrendingUp,
  Sliders,
  HelpCircle
} from 'lucide-react';

interface WorkflowGuidePageProps {
  onOpenContactModal: () => void;
  onOpenAiEstimator: () => void;
}

export const WorkflowGuidePage: React.FC<WorkflowGuidePageProps> = ({
  onOpenContactModal,
  onOpenAiEstimator
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'calculator' | 'code' | 'pitch'>('blueprint');
  const [copiedCode, setCopiedCode] = useState(false);

  // 3D Client Profit Calculator State
  const [scopeType, setScopeType] = useState<'Hero3D' | 'ScrollStory' | 'ProductConfigurator' | 'Enterprise3D'>('ScrollStory');
  const [assetComplexity, setAssetComplexity] = useState<'Standard' | 'CustomBlender' | 'Photorealistic'>('CustomBlender');
  const [retainerIncluded, setRetainerIncluded] = useState<boolean>(true);

  // Price Calculation Logic
  const getCalculatedQuote = () => {
    let base = 8500;
    if (scopeType === 'Hero3D') base = 6000;
    if (scopeType === 'ScrollStory') base = 14500;
    if (scopeType === 'ProductConfigurator') base = 22000;
    if (scopeType === 'Enterprise3D') base = 35000;

    let multiplier = 1.0;
    if (assetComplexity === 'CustomBlender') multiplier = 1.35;
    if (assetComplexity === 'Photorealistic') multiplier = 1.75;

    const totalProjectPrice = Math.round(base * multiplier);
    const estimatedCostToBuild = Math.round(totalProjectPrice * 0.28); // ~72% profit margin
    const netProfit = totalProjectPrice - estimatedCostToBuild;
    const monthlyRetainer = retainerIncluded ? 2200 : 0;

    return { totalProjectPrice, estimatedCostToBuild, netProfit, monthlyRetainer };
  };

  const quote = getCalculatedQuote();

  const handleCopySnippet = () => {
    const codeSnippet = `// BYTEBROTHERS - THREE.JS SCROLL TRIGGER ENGINE
import * as THREE from 'three';
import { GSAP } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class Cinematic3DEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Bind ScrollTrigger to Camera Position
    gsap.to(this.camera.position, {
      z: 3.5,
      y: -2.0,
      scrollTrigger: {
        trigger: ".hero-3d-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2
      }
    });
  }
}
export default Cinematic3DEngine;`;

    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 max-w-4xl border-b border-[var(--border-color)] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
          <Workflow className="h-3.5 w-3.5 text-cyan-400" />
          <span>5-YEAR WORKFLOW ENGINEER MASTERCLASS BLUEPRINT</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)]">
          How to Design &amp; Sell <span className="text-blue-500 underline decoration-blue-500/30">3D Websites</span> for Maximum Profit
        </h1>
        <p className="text-base text-[var(--text-secondary)] leading-relaxed">
          A battle-tested operational guide created by ByteBrothers for web agencies, developers, and designers. Learn how to structure 3D asset pipelines, integrate WebGL &amp; Webflow Enterprise, land $15,000+ client projects, and establish high-margin recurring retainers.
        </p>
      </div>

      {/* Guide Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-color)] pb-2">
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'blueprint'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>1. The 5-Phase Workflow</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'calculator'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]'
          }`}
        >
          <DollarSign className="h-4 w-4 text-emerald-400" />
          <span>2. 3D Profit Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('pitch')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pitch'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]'
          }`}
        >
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          <span>3. High-Ticket Client Pitch</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'code'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>4. Starter Code &amp; Config</span>
        </button>
      </div>

      {/* TAB 1: THE 5-PHASE WORKFLOW BLUEPRINT */}
      {activeTab === 'blueprint' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Phase 1 */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold border border-blue-400/30">
                  PHASE 01
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">Days 1–3</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                3D Storyboarding &amp; Figma Spatial Wireframes
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Before touching Blender or Three.js, map out spatial camera keyframes in Figma. Define exact scroll triggers, CTA callouts, and 3D object focal points.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Establish camera path &amp; Z-index depth</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Confirm desktop &amp; mobile 2D fallbacks</span>
                </li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold border border-blue-400/30">
                  PHASE 02
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">Days 4–7</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                3D Asset Pipeline &amp; Compression
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Create models in Blender or Spline. Target under 50,000 polygons total. Bake lighting textures, convert shaders to PBR glTF, and apply DRACO compression for sub-second network payloads.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>GLTF / GLB compression target &lt; 2.5MB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Bake ambient occlusion into UV map</span>
                </li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold border border-blue-400/30">
                  PHASE 03
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">Days 8–12</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                Webflow Enterprise &amp; WebGL Integration
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Embed WebGL canvas inside Webflow using Client-First v2 class structures. Bind GSAP ScrollTrigger to camera vectors for smooth 60 FPS scrolling interactions.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Client-First v2 DOM wrapper naming</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Hardware acceleration &amp; resize observers</span>
                </li>
              </ul>
            </div>

            {/* Phase 4 */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-[var(--bg-surface)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-cyan-300 font-mono text-xs font-bold border border-blue-400/30">
                  PHASE 04
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)]">Days 13–15</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                Lighthouse 100/100 Speed Optimization
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Lazy-load heavy WebGL scripts until user scroll intent. Implement low-battery GPU degradation handlers and WebP static hero fallbacks for mobile browsers.
              </p>
              <ul className="space-y-2 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>IntersectionObserver script hydration</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>Sub-20ms first contentful paint</span>
                </li>
              </ul>
            </div>

            {/* Phase 5 */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-[var(--bg-surface)] space-y-4 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-400/30">
                  PHASE 05 • PROFIT ENGINE
                </span>
                <span className="font-mono text-xs text-emerald-400">Recurring Retainer</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                Client Handoff &amp; $2,200/mo Monthly 3D Maintenance
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Deliver a custom Webflow CMS video guide allowing client marketing teams to update copy, image hot-spots, and product variations without touching code. Sell an ongoing $2,200/mo maintenance retainer for seasonal 3D texture updates, performance monitoring, and model swapping.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Average 3D Project Price</div>
                  <div className="text-emerald-400 font-bold text-base mt-0.5">$14,500 – $28,000</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Agency Profit Margin</div>
                  <div className="text-blue-400 font-bold text-base mt-0.5">70% – 82% Net</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 3D PROFIT CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-[var(--bg-surface)] to-[var(--bg-surface)] space-y-8 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold uppercase">
              <DollarSign className="h-4 w-4" />
              <span>INTERACTIVE AGENCY REVENUE SIMULATOR</span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              Calculate Your Profit on a 3D Website Build
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Adjust project parameters to simulate agency pricing, direct build costs, net profit, and recurring monthly retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls Form */}
            <div className="space-y-6 lg:col-span-2 bg-[var(--bg-primary)]/80 p-6 rounded-2xl border border-[var(--border-color)]">
              {/* Scope Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">
                  1. Project Scope &amp; 3D Depth
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Hero3D', title: 'Single Hero 3D Object', price: '$6,000+' },
                    { id: 'ScrollStory', title: 'Full 3D Scroll Storytelling', price: '$14,500+' },
                    { id: 'ProductConfigurator', title: '3D Product Configurator', price: '$22,000+' },
                    { id: 'Enterprise3D', title: 'Enterprise Webflow 3D World', price: '$35,000+' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setScopeType(item.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-mono text-xs ${
                        scopeType === item.id
                          ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-blue-400/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.title}</span>
                        <span className="text-emerald-400 text-[10px]">{item.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Complexity */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">
                  2. 3D Asset Complexity &amp; Textures
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Standard', label: 'Standard Low-Poly' },
                    { id: 'CustomBlender', label: 'Custom Blender PBR' },
                    { id: 'Photorealistic', label: 'Photorealistic VFX' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAssetComplexity(item.id as any)}
                      className={`p-3 rounded-xl border text-center font-mono text-xs transition-all ${
                        assetComplexity === item.id
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-bold'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Retainer Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div>
                  <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Include Monthly 3D Care &amp; CMS Retainer
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Ongoing 3D performance monitoring, texture swaps &amp; updates ($2,200/mo)
                  </div>
                </div>
                <button
                  onClick={() => setRetainerIncluded(!retainerIncluded)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    retainerIncluded ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      retainerIncluded ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Results Card */}
            <div className="p-6 rounded-2xl border border-emerald-500/40 bg-[var(--bg-primary)] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  PROJECT FINANCIAL BREAKDOWN
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Client Quote Price</div>
                    <div className="text-3xl font-display font-bold text-white">
                      ${quote.totalProjectPrice.toLocaleString()}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-color)] flex justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)]">Est. Build Overhead:</span>
                    <span className="text-zinc-300">${quote.estimatedCostToBuild.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)]">Net Agency Profit:</span>
                    <span className="text-emerald-400 font-bold">${quote.netProfit.toLocaleString()}</span>
                  </div>

                  {retainerIncluded && (
                    <div className="flex justify-between text-xs font-mono text-cyan-300 pt-2 border-t border-[var(--border-color)]">
                      <span>Annual Retainer Value:</span>
                      <span className="font-bold">+ ${(quote.monthlyRetainer * 12).toLocaleString()} / yr</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
                <button
                  onClick={onOpenContactModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Build This 3D System</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HIGH-TICKET CLIENT PITCH SCRIPT */}
      {activeTab === 'pitch' && (
        <div className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>THE $20K CLIENT PROPOSAL SCRIPT</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
              How to Pitch 3D Webflow Sites to Enterprise Executives
            </h2>
          </div>

          <div className="space-y-4 font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-blue-500/30 space-y-2">
              <div className="text-blue-400 font-bold">1. Reframe 3D from "Pretty Visual" to "Conversion Accelerator"</div>
              <p>
                "We don’t just add 3D graphics for looks. We use interactive spatial storytelling to increase time-on-page by 3.4x, boost product comprehension, and set your brand apart as the indisputable market leader."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-blue-500/30 space-y-2">
              <div className="text-blue-400 font-bold">2. Address Speed &amp; Mobile Concerns Early</div>
              <p>
                "Our 3D engine uses WebGL DRACO compression with automatic 2D static fallbacks. Your mobile users get sub-1-second page loads, while desktop users enjoy a cinematic 60 FPS spatial experience."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-blue-500/30 space-y-2">
              <div className="text-blue-400 font-bold">3. Guarantee Marketing Team Autonomy (No Code Locks)</div>
              <p>
                "We integrate your 3D canvas into Webflow Enterprise CMS. Your internal marketing team can modify text, add new products, and edit copy seamlessly without breaking the 3D pipeline."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STARTER CODE SNIPPET */}
      {activeTab === 'code' && (
        <div className="p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs text-blue-400 font-bold flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>BYTEBROTHERS - THREE.JS &amp; GSAP BOILERPLATE</span>
            </div>
            <button
              onClick={handleCopySnippet}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Snippet'}</span>
            </button>
          </div>

          <pre className="p-6 rounded-2xl bg-[#08090a] text-zinc-300 font-mono text-xs overflow-x-auto border border-zinc-800 leading-relaxed">
{`// BYTEBROTHERS - THREE.JS SCROLL TRIGGER ENGINE
import * as THREE from 'three';
import { GSAP } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class Cinematic3DEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Bind ScrollTrigger to Camera Position
    gsap.to(this.camera.position, {
      z: 3.5,
      y: -2.0,
      scrollTrigger: {
        trigger: ".hero-3d-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2
      }
    });
  }
}
export default Cinematic3DEngine;`}
          </pre>
        </div>
      )}
    </div>
  );
};
