import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Clock, ArrowRight } from 'lucide-react';
import { StarRating } from './StarRating';
import { useApp } from '../context/AppContext';
import { cropCategories } from '../data/cultivars';

function getCropImage(cropType) {
  const category = cropCategories.find(cat => cat.types.includes(cropType));
  return category?.image || '/crops/tomato.jpg';
}

export function CultivarCard({ cultivar }) {
  const { getCultivarStats } = useApp();
  const stats = cultivar.stats || getCultivarStats(cultivar.id);
  const cropImage = getCropImage(cultivar.crop_type);

  return (
    <Link
      to={`/cultivar/${cultivar.id}`}
      className="group card overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={cropImage}
          alt={cultivar.crop_type}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {cultivar.open_pollinated && (
          <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
            Open Pollinated
          </span>
        )}
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="font-bold text-white text-lg leading-tight">{cultivar.name}</h3>
          <p className="text-sm text-white/80">{cultivar.crop_type} &middot; {cultivar.crop_subtype}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {stats ? (
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating rating={stats.avgRating} size={14} />
                <span className="text-sm font-semibold text-foreground">{stats.avgRating.toFixed(1)}</span>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare size={12} />
                {stats.reviewCount}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-primary">
                <ThumbsUp size={14} />
                <span className="font-medium">{stats.wouldGrowAgainPct}%</span>
              </div>
              <span className="text-xs text-muted-foreground">would grow again</span>
            </div>

            {stats.topAttributes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {stats.topAttributes.slice(0, 2).map(attr => (
                  <span key={attr} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                    {attr}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic flex-1">No reviews yet</p>
        )}

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {cultivar.days_to_maturity} days
          </span>
          <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
