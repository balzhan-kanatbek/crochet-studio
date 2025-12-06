"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
  generatedImage: string | null;
  setGeneratedImage: (url: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        uploadedImage,
        setUploadedImage,
        generatedImage,
        setGeneratedImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
