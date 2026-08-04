import React, { useEffect } from "react";
import { HomeScrollPanels } from "../components/home/HomeScrollPanels";
import { HomeMobileFallback } from "../components/home/HomeMobileFallback";

interface HomePageProps {
  setActiveTab:       (tab: string) => void;
  onSelectProject:    (project: unknown) => void;
  onOpenAiEstimator:  () => void;
  onOpenContactModal: () => void;
  use3DCorridor?:     boolean;  // passed from App — capability already computed
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onOpenContactModal,
  use3DCorridor = false,
}) => {
  // Reset scroll on mount so corridor always starts at bay 0
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleContact  = () => { onOpenContactModal(); };
  const handleWork     = () => { setActiveTab("portfolio"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handlePortfolio = () => { setActiveTab("portfolio"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  if (!use3DCorridor) {
    return (
      <HomeMobileFallback
        onContact={handleContact}
        onWork={handleWork}
        onPortfolio={handlePortfolio}
      />
    );
  }

  // 3D corridor: just the scroll track + DOM panels.
  // The Canvas is mounted once in App.tsx above this component.
  return (
    <HomeScrollPanels
      onContact={handleContact}
      onWork={handleWork}
    />
  );
};

export default HomePage;
