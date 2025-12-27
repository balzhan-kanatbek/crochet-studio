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

  useEffect(() => {
    if (!selectedColor) {
      router.push("/");
    }
  }, [selectedColor, router]);

  const createPreview = (file: File) => {
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

        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 px-2">
            Try On Your Perfect Bandana
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
            See how you&apos;ll look in our handmade crochet bandanas
          </p>
        </div>

        <ProgressStepper currentStep={2} />

        <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Step 2: Upload Your Photo
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8">
            Upload a clear headshot to see how the bandana looks on you
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 md:p-12 text-center cursor-pointer hover:border-purple-400 transition-colors mb-4 sm:mb-6"
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
              <div className="space-y-2 sm:space-y-4">
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="mx-auto rounded-lg object-cover w-full max-w-[200px] sm:max-w-[300px]"
                />
                <p className="text-xs sm:text-sm text-gray-600">
                  Click to change photo
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-4">
                <div className="text-2xl sm:text-4xl">📷</div>
                <div>
                  <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                    Drag and drop your photo here
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={!uploadedImage}
            className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold transition-all ${
              uploadedImage
                ? "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>

        <div className="text-center mt-6 sm:mt-12 text-xs sm:text-sm text-gray-500">
          Made with love by Crochet Studio
        </div>
      </div>
    </div>
  );
}
