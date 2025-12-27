"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import ProgressStepper from "../components/ProgressStepper";
import { useState, useEffect } from "react";

export default function PreviewPage() {
  const router = useRouter();
  const {
    selectedColor,
    uploadedImage,
    generatedImage,
    setGeneratedImage,
    setUploadedImage,
  } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedImage) {
      const objectUrl = URL.createObjectURL(uploadedImage);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (!selectedColor || !uploadedImage) {
      router.push("/");
    }
  }, [selectedColor, uploadedImage, router]);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedColor) return;
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("color", selectedColor);
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedImage(data.imageUrl);
      } else {
        alert(`Oops! ${data.error || "Failed to generate image."}`);
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const mimeType =
        generatedImage.match(/data:([^;]+);/)?.[1] || "image/png";
      const extension = mimeType.split("/")[1] || "png";
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `crochet-bandana-pro.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTryAnotherColor = () => {
    setGeneratedImage(null); // Clear the AI result only
    router.push("/"); // Return to Step 1 (Color Selection)
  };

  const handleStartOver = () => {
    setGeneratedImage(null);
    setUploadedImage(null); // Completely clear the session
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50/30 via-white to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/crochet-studio-logo.png"
            alt="Crochet Studio"
            width={200}
            height={60}
            priority
          />
        </div>

        <ProgressStepper currentStep={3} />

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Step 3: Preview Your Look
          </h2>

          <div className="mb-8">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">
                  Generating your bandana preview...
                </p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-6">
                <Image
                  src={generatedImage}
                  alt="Generated preview"
                  width={600}
                  height={600}
                  className="mx-auto rounded-lg object-cover"
                />

                <div className="flex flex-col gap-3">
                  {/* 1. Primary Action: Download */}
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 px-6 rounded-full font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg transition-all"
                  >
                    Download Image
                  </button>

                  <div className="flex gap-3">
                    {/* 2. Secondary Action: Keep Image, change color */}
                    <button
                      onClick={handleTryAnotherColor}
                      className="flex-1 py-3 px-6 rounded-full font-semibold border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      Try Another Color
                    </button>

                    {/* 3. Reset Action: Back to main page */}
                    <button
                      onClick={handleStartOver}
                      className="flex-1 py-3 px-6 rounded-full font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {preview && (
                  <Image
                    src={preview}
                    alt="Your photo"
                    width={600}
                    height={600}
                    className="mx-auto rounded-lg object-cover"
                  />
                )}
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 px-6 rounded-full font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg transition-all"
                >
                  Generate Preview
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
