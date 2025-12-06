"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "./context/AppContext";
import ProgressStepper from "./components/ProgressStepper";

const colors = [
  { name: "Coral", value: "coral", hex: "#FF7F50" },
  { name: "Lavender", value: "lavender", hex: "#E6E6FA" },
  { name: "Mint", value: "mint", hex: "#98FB98" },
  { name: "Sunshine", value: "sunshine", hex: "#FFD700" },
  { name: "Sky Blue", value: "sky-blue", hex: "#87CEEB" },
  { name: "Peach", value: "peach", hex: "#FFDAB9" },
  { name: "Rose", value: "rose", hex: "#FFB6C1" },
  { name: "Sage", value: "sage", hex: "#9DC183" },
];

export default function Home() {
  const router = useRouter();
  const { selectedColor, setSelectedColor } = useApp();

  const handleContinue = () => {
    if (selectedColor) {
      router.push("/upload");
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
            See how you'll look in our handmade crochet bandanas
          </p>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={1} />

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Step 1: Choose Your Color
          </h2>
          <p className="text-gray-600 mb-8">
            Select the bandana color you'd like to try on
          </p>

          {/* Color Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  selectedColor === color.value
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-full border-4 transition-all ${
                    selectedColor === color.value
                      ? "border-purple-500 shadow-lg ring-4 ring-purple-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {color.name}
                </span>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedColor}
            className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
              selectedColor
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
