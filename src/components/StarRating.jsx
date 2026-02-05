import { Star } from 'lucide-react';

export function StarRating({ rating, size = 16, showValue = false, className = '' }) {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rounded);
    const half = !filled && i - 0.5 <= rounded;

    stars.push(
      <Star
        key={i}
        size={size}
        className={filled || half ? 'text-amber-400 fill-amber-400' : 'text-muted'}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {stars}
      {showValue && <span className="ml-1 text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>}
    </span>
  );
}

export function StarPicker({ value, onChange, size = 24, label }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className="p-0.5 hover:scale-110 transition-transform"
          >
            <Star
              size={size}
              className={i <= value ? 'text-amber-400 fill-amber-400' : 'text-muted hover:text-amber-300'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
