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
    setGeneratedImage(null);
    router.push("/");
  };

  const handleStartOver = () => {
    setGeneratedImage(null);
    setUploadedImage(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex justify-center mb-4 sm:mb-8">
          <Image
            src="/crochet-studio-logo.png"
            alt="Crochet Studio"
            width={200}
            height={60}
            className="h-auto w-32 sm:w-48"
            priority
          />
        </div>

        <ProgressStepper currentStep={3} />

        <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
            Step 3: Preview Your Look
          </h2>

          <div className="mb-4 sm:mb-6 md:mb-8">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-purple-500 border-t-transparent mb-3 sm:mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600 text-center px-2">
                  Generating your bandana preview...
                </p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4 sm:space-y-6">
                <Image
                  src={generatedImage}
                  alt="Generated preview"
                  width={600}
                  height={600}
                  className="mx-auto rounded-lg object-cover w-full max-w-full"
                />

                <div className="flex flex-col gap-2 sm:gap-3">
                  <button
                    onClick={handleDownload}
                    className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg transition-all"
                  >
                    Download Image
                  </button>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleTryAnotherColor}
                      className="flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all"
                    >
                      Try Another Color
                    </button>

                    <button
                      onClick={handleStartOver}
                      className="flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {preview && (
                  <Image
                    src={preview}
                    alt="Your photo"
                    width={600}
                    height={600}
                    className="mx-auto rounded-lg object-cover w-full max-w-full"
                  />
                )}
                <button
                  onClick={handleGenerate}
                  className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg transition-all"
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
