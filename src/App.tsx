import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { Background3dCanvas } from './components/Background3dCanvas';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ProjectModal } from './components/ProjectModal';
import { AiEstimatorModal } from './components/AiEstimatorModal';
import { DevRoomCorridor } from './components/home/DevRoomCorridor';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { WorkflowGuidePage } from './pages/WorkflowGuidePage';
import { GalleryPage } from './pages/GalleryPage';
import { RotatablePortfolioPage } from './pages/RotatablePortfolioPage';
import { Project } from './data/studioData';
import { registerServiceWorker, useOnlineStatus } from './utils/offlineCache';
import { WifiOff } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiEstimatorOpen, setAiEstimatorOpen] = useState<boolean>(false);
  const [attachedSpec, setAttachedSpec] = useState<string | undefined>(undefined);
  const [showPreloader, setShowPreloader] = useState<boolean>(false);

  const isOnline = useOnlineStatus();

  // Capability check — enables 3D DevRoomCorridor on desktop viewports with WebGL
  const use3DCorridor = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (window.innerWidth < 768) return false;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return false;
    } catch { return false; }
    return true;
  }, []);

  const reducedMotion = useMemo(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false, []);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const handleOpenInquiryFromProject = (projectTitle: string) => {
    setAttachedSpec(`Inquiry regarding project architecture: ${projectTitle}`);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEstimate = (estimateText: string) => {
    setAttachedSpec(estimateText);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`text-[var(--text-primary)] transition-colors duration-300 relative ${activeTab === 'home' ? '' : 'min-h-screen flex flex-col'}`}
      style={{ background: activeTab === 'home' ? '#f8fafc' : 'var(--bg-primary)' }}
    >
      {/* 3D Wireframe Background Canvas — hidden on home tab */}
      {activeTab !== 'home' && <Background3dCanvas />}

      {/* DevRoomCorridor — active walkthrough mounted on home tab */}
      {use3DCorridor && (
        <DevRoomCorridor
          visible={activeTab === 'home'}
          reducedMotion={reducedMotion}
        />
      )}

      {/* ByteBrothers Preloader on initial load */}
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      {/* Scroll Progress Bar — hidden on home tab (corridor has its own HUD) */}
      {activeTab !== 'home' && <ScrollProgressBar />}

      {/* Non-intrusive Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-400 py-2 px-4 font-mono text-xs text-center flex items-center justify-center gap-2">
          <WifiOff className="h-3.5 w-3.5 animate-pulse" />
          <span>You are currently offline. Service Worker cache active. Form submissions will queue locally.</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiEstimator={() => setAiEstimatorOpen(true)}
        onOpenContactModal={() => {
          setActiveTab('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* View Containers */}
      <main className={`${activeTab === 'home' ? 'block' : 'flex-1 relative'}`}>
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onOpenAiEstimator={() => setAiEstimatorOpen(true)}
            onOpenContactModal={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            use3DCorridor={use3DCorridor}
          />
        )}

        {activeTab === 'about' && <AboutPage />}

        {activeTab === 'portfolio' && (
          <PortfolioPage onSelectProject={(proj) => setSelectedProject(proj)} />
        )}

        {activeTab === 'services' && (
          <ServicesPage
            onOpenContactModal={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAiEstimator={() => setAiEstimatorOpen(true)}
          />
        )}

        {activeTab === 'workflow-guide' && (
          <WorkflowGuidePage
            onOpenContactModal={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAiEstimator={() => setAiEstimatorOpen(true)}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryPage />
        )}

        {activeTab === 'rotatable-portfolio' && (
          <RotatablePortfolioPage />
        )}

        {activeTab === 'contact' && (
          <ContactPage
            onOpenAiEstimator={() => setAiEstimatorOpen(true)}
            attachedSpec={attachedSpec}
          />
        )}
      </main>

      {/* Footer — hidden on home tab (corridor has its own CTA bay) */}
      {activeTab !== 'home' && (
        <Footer
          setActiveTab={setActiveTab}
          onOpenContactModal={() => {
            setActiveTab('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenInquiry={handleOpenInquiryFromProject}
      />

      <AiEstimatorModal
        isOpen={aiEstimatorOpen}
        onClose={() => setAiEstimatorOpen(false)}
        onSelectEstimate={handleSelectEstimate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
