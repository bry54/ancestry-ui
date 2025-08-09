import { createContext, useContext, useState } from 'react';

type LayoutContextType = {
  isFooterVisible: boolean;
  setFooterVisibility: (isVisible: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isFooterVisible, setFooterVisibility] = useState(true);

  return (
    <LayoutContext.Provider value={{ isFooterVisible, setFooterVisibility }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
