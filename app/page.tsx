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

        <ProgressStepper currentStep={1} />

        <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
            Step 1: Choose Your Color
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8">
            Select the bandana color you&apos;d like to try on
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`flex flex-col items-center gap-1 sm:gap-2 transition-all ${
                  selectedColor === color.value
                    ? "scale-105 sm:scale-110"
                    : "hover:scale-105"
                }`}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 sm:border-4 transition-all ${
                    selectedColor === color.value
                      ? "border-purple-500 shadow-lg ring-2 sm:ring-4 ring-purple-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {color.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedColor}
            className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base font-semibold transition-all ${
              selectedColor
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
