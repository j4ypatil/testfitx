import { ArrowLeft } from 'lucide-react';
import ProgressBar from './ProgressBar.jsx';

export default function QuestionScreen({
  question,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onBack,
  canContinue,
  onContinue,
  showBack = true,
}) {
  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <div className="flex-1 px-6 pt-6 pb-4 flex flex-col">
        <div className="mb-6">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-light-card border border-light-border flex items-center justify-center mb-4 hover:bg-light-border transition-colors"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
          ) : (
            <div className="h-10 mb-4" />
          )}
          <ProgressBar current={currentStep} total={totalSteps} />
        </div>

        <div className="flex-1 flex flex-col">
          <h1 className="text-[40px] leading-[1.1] font-bold text-foreground mb-2">
            {question}
          </h1>
          {subtitle && (
            <p className="text-light-muted text-base mb-8">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-8" />}

          <div className="flex-1">{children}</div>
        </div>
      </div>

      <div className="px-6 pb-10 pt-4">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`btn-primary ${canContinue ? 'btn-primary-active' : 'btn-primary-disabled'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
