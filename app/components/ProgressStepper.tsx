interface ProgressStepperProps {
  currentStep: number;
}

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const steps = [
    { number: 1, label: 'Choose Color' },
    { number: 2, label: 'Upload Photo' },
    { number: 3, label: 'Preview' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all ${
                  isActive
                    ? 'bg-linear-to-br from-purple-500 to-pink-500 shadow-lg'
                    : isCompleted
                    ? 'bg-linear-to-br from-purple-500 to-pink-500'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isActive
                    ? 'text-purple-600'
                    : isCompleted
                    ? 'text-purple-600'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-4 transition-all ${
                  isCompleted ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

