"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import ProgressStepper from "../components/ProgressStepper";
import { useState, useEffect } from "react";

export default function PreviewPage() {
  const router = useRouter();
  const { selectedColor, uploadedImage, generatedImage, setGeneratedImage } =
    useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedImage) {
      const objectUrl = URL.createObjectURL(uploadedImage);
      setPreview(objectUrl);

      // Cleanup: revoke the blob URL when component unmounts or uploadedImage changes
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [uploadedImage]);

  // Redirect if no color or image selected
  useEffect(() => {
    if (!selectedColor || !uploadedImage) {
      router.push("/");
    }
  }, [selectedColor, uploadedImage, router]);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedColor) return;

    setIsGenerating(true);

    try {
      // TODO: Integrate with Nano Banana Pro API
      // For now, we'll simulate the API call
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("color", selectedColor);

      // Replace this with actual Nano Banana Pro API call
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedImage(data.imageUrl);
      } else {
        console.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "bandana-preview.jpg";
      link.click();
    }
  };

  const handleStartOver = () => {
    router.push("/");
  };

  if (!selectedColor || !uploadedImage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50/30 via-white to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/crochet-studio-logo.png"
            alt="Crochet Studio"
            width={200}
            height={60}
            className="h-auto"
            priority
          />
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Try On Your Perfect Bandana
          </h1>
          <p className="text-lg text-gray-600">
            See how you&apos;ll look in our handmade crochet bandanas
          </p>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={3} />

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Step 3: Preview Your Look
          </h2>
          <p className="text-gray-600 mb-8">
            Your bandana is being generated with AI
          </p>

          {/* Preview Area */}
          <div className="mb-8">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">
                  Generating your bandana preview...
                </p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4">
                <Image
                  src={generatedImage}
                  alt="Generated preview"
                  width={600}
                  height={600}
                  className="mx-auto rounded-lg object-cover"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 px-6 rounded-full font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                  >
                    Download Image
                  </button>
                  <button
                    onClick={handleStartOver}
                    className="flex-1 py-3 px-6 rounded-full font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all"
                  >
                    Try Another
                  </button>
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
                  className="w-full py-3 px-6 rounded-full font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                >
                  Generate Preview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          Made with love by Crochet Studio
        </div>
      </div>
    </div>
  );
}
