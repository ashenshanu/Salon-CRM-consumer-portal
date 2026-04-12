interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function StepProgressBar({ currentStep, totalSteps, labels }: StepProgressBarProps) {
  return (
    <div className="w-full">
      {/* Bar */}
      <div className="flex items-center gap-0">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div
                className={[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isCompleted
                    ? 'bg-primary text-white'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {/* Connector line */}
              {i < totalSteps - 1 && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-1 transition-colors',
                    isCompleted ? 'bg-primary' : 'bg-slate-200',
                  ].join(' ')}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Labels */}
      {labels && (
        <div className="mt-2 flex justify-between">
          {labels.map((label, i) => {
            const step = i + 1;
            const isCurrent = step === currentStep;
            return (
              <span
                key={i}
                className={`text-xs ${isCurrent ? 'text-slate-900 font-medium' : 'text-slate-400'}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
