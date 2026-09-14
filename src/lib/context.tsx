"use client";

import React from "react";

export interface SelectedSppt {
  nop: string;
  tahun: string;
}

interface SpptContextValue {
  selected: SelectedSppt | null;
  setSelected: (v: SelectedSppt | null) => void;
}

const SpptContext = React.createContext<SpptContextValue>({
  selected: null,
  setSelected: () => {},
});

export function SpptProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = React.useState<SelectedSppt | null>(null);
  return (
    <SpptContext.Provider value={{ selected, setSelected }}>
      {children}
    </SpptContext.Provider>
  );
}

export const useSpptSelection = () => React.useContext(SpptContext);
