import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="fixed inset-0 bg-black/20 z-[100]" onClick={() => setTourActive(false)} />

      {/* Tooltip */}
      <div
        className="fixed z-[101] bg-white rounded-xl shadow-xl border border-stone-200 p-5 w-80"
        style={{ top: position.top, left: position.left }}
      >
        <button
          onClick={() => setTourActive(false)}
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-600"
        >
          <X size={16} />
        </button>

        <div className="text-xs text-stone-400 mb-1">
          Step {tourStep + 1} of {steps.length}
        </div>
        <h3 className="font-bold text-stone-900 mb-1">{step.title}</h3>
        <p className="text-sm text-stone-600 mb-4">{step.description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setTourActive(false)}
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={() => setTourStep(tourStep - 1)}
                className="p-1.5 rounded-lg border border-stone-300 hover:bg-stone-50"
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
              className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
