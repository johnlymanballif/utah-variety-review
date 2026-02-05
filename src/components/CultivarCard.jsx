import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { StarRating } from './StarRating';
import { useApp } from '../context/AppContext';

export function CultivarCard({ cultivar }) {
  const { getCultivarStats } = useApp();
  const stats = cultivar.stats || getCultivarStats(cultivar.id);

  return (
    <Link
      to={`/cultivar/${cultivar.id}`}
      className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-green-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-stone-900">{cultivar.name}</h3>
          <p className="text-sm text-stone-500">{cultivar.crop_type} &middot; {cultivar.crop_subtype}</p>
        </div>
        {cultivar.open_pollinated && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">OP</span>
        )}
      </div>

      {stats ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <StarRating rating={stats.avgRating} size={14} />
            <span className="text-sm text-stone-600">{stats.avgRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              <MessageSquare size={14} />
              {stats.reviewCount} {stats.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={14} />
              {stats.wouldGrowAgainPct}% grow again
            </span>
          </div>
          {stats.topAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {stats.topAttributes.map(attr => (
                <span key={attr} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                  {attr}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-stone-400 mt-3 italic">No reviews yet</p>
      )}

      <div className="mt-3 pt-2 border-t border-stone-100 text-xs text-stone-400">
        {cultivar.days_to_maturity} days to maturity
      </div>
    </Link>
  );
}
