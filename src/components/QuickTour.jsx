import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const steps = [
  {
    target: '[data-tour="hero"]',
    title: 'Search for varieties',
    description: 'Find any vegetable variety in our database. Search by name or crop type.',
    route: '/',
  },
  {
    target: '[data-tour="browse-crops"]',
    title: 'Browse by crop',
    description: 'Explore varieties organized by crop type. Each card shows how many varieties we track.',
    route: '/',
  },
  {
    target: '[data-tour="write-review"]',
    title: 'Write a review',
    description: 'Share your growing experience. Rate varieties on yield, flavor, disease resistance, and heat tolerance.',
    route: '/',
  },
  {
    target: '[data-tour="profile"]',
    title: 'Your profile',
    description: 'View your submitted reviews and growing profile. Pick a persona to get started.',
    route: '/',
  },
];

export function QuickTour() {
  const { tourActive, setTourActive, tourStep, setTourStep, currentUser } = useApp();
  const navigate = useNavigate();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const step = steps[tourStep];
    if (!step) return;
    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 12,
        left: Math.max(16, Math.min(rect.left + rect.width / 2 - 160, window.innerWidth - 336)),
      });

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [tourStep]);

  useEffect(() => {
    if (!tourActive) return;
    const step = steps[tourStep];
    if (step?.route) navigate(step.route);

    const timer = setTimeout(updatePosition, 300);
    return () => clearTimeout(timer);
  }, [tourActive, tourStep, navigate, updatePosition]);

  if (!tourActive) return null;

  const step = steps[tourStep];
  if (!step) return null;

  const isFirst = tourStep === 0;
  const isLast = tourStep === steps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]" onClick={() => setTourActive(false)} />

      {/* Tooltip */}
      <div
        className="fixed z-[101] bg-card rounded-xl shadow-xl border border-border p-5 w-80"
        style={{ top: position.top, left: position.left }}
      >
        <button
          onClick={() => setTourActive(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Sparkles size={12} className="text-primary" />
          Step {tourStep + 1} of {steps.length}
        </div>
        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === tourStep ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setTourActive(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={() => setTourStep(tourStep - 1)}
                className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) {
                  setTourActive(false);
                } else {
                  setTourStep(tourStep + 1);
                }
              }}
              className="btn-primary"
            >
              {isLast ? 'Done' : 'Next'}
              {!isLast && <ChevronRight size={14} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
