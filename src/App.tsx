import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ProjectModal } from './components/ProjectModal';
import { AiEstimatorModal } from './components/AiEstimatorModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { WorkflowGuidePage } from './pages/WorkflowGuidePage';
import { Project } from './data/studioData';
import { registerServiceWorker, useOnlineStatus } from './utils/offlineCache';
import { WifiOff } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiEstimatorOpen, setAiEstimatorOpen] = useState<boolean>(false);
  const [attachedSpec, setAttachedSpec] = useState<string | undefined>(undefined);
  const [showPreloader, setShowPreloader] = useState<boolean>(true);

  const isOnline = useOnlineStatus();

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
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* White Brothers Preloader on initial load */}
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      {/* Scroll Progress Bar at top of viewport */}
      <ScrollProgressBar />

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
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onOpenAiEstimator={() => setAiEstimatorOpen(true)}
            onOpenContactModal={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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

        {activeTab === 'contact' && (
          <ContactPage
            onOpenAiEstimator={() => setAiEstimatorOpen(true)}
            attachedSpec={attachedSpec}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenContactModal={() => {
          setActiveTab('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

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
