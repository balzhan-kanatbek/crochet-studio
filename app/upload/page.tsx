"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import ProgressStepper from "../components/ProgressStepper";
import { useRef, useState, useEffect } from "react";

export default function UploadPage() {
  const router = useRouter();
  const { selectedColor, uploadedImage, setUploadedImage } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    uploadedImage ? URL.createObjectURL(uploadedImage) : null
  );

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Redirect if no color selected
  useEffect(() => {
    if (!selectedColor) {
      router.push("/");
    }
  }, [selectedColor, router]);

  const createPreview = (file: File) => {
    // Revoke previous preview URL if it exists
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setUploadedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      createPreview(file);
    }
  };

  const handleContinue = () => {
    if (uploadedImage) {
      router.push("/preview");
    }
  };

  // Don't render if no color selected (redirecting)
  if (!selectedColor) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      createPreview(file);
    }
  };

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
        <ProgressStepper currentStep={2} />

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Step 2: Upload Your Photo
          </h2>
          <p className="text-gray-600 mb-8">
            Upload a clear headshot to see how the bandana looks on you
          </p>

          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 transition-colors mb-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              <div className="space-y-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="mx-auto rounded-lg object-cover"
                />
                <p className="text-sm text-gray-600">Click to change photo</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl">📷</div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your photo here
                  </p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!uploadedImage}
            className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
              uploadedImage
                ? "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          Made with love by Crochet Studio
        </div>
      </div>
    </div>
  );
}
