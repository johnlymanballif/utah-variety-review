import { useParams, Link } from 'react-router-dom';
import { PenSquare, ChevronRight, ThumbsUp, MessageSquare, MapPin, Thermometer, Calendar } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { cultivars } from '../data/cultivars';
import { users } from '../data/users';

function RatingBar({ label, value }) {
  if (value === null) return null;
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-stone-500 w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-stone-900 w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

export function CultivarDetailPage() {
  const { id } = useParams();
  const { getCultivarStats, getReviewsForCultivar } = useApp();

  const cultivar = cultivars.find(c => c.id === id);
  if (!cultivar) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Variety not found</h1>
        <Link to="/browse" className="text-green-600 hover:text-green-700 mt-4 inline-block">Browse varieties</Link>
      </div>
    );
  }

  const stats = getCultivarStats(cultivar.id);
  const reviews = getReviewsForCultivar(cultivar.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-stone-500 mb-6">
        <Link to="/browse" className="hover:text-green-600">Browse</Link>
        <ChevronRight size={14} />
        <Link
          to={`/browse?crop=${encodeURIComponent(cultivar.crop_type)}`}
          className="hover:text-green-600"
        >
          {cultivar.crop_type}
        </Link>
        <ChevronRight size={14} />
        <span className="text-stone-900 font-medium">{cultivar.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">{cultivar.name}</h1>
          <p className="text-stone-500 mt-1">
            {cultivar.crop_type} &middot; {cultivar.crop_subtype}
            {cultivar.open_pollinated && (
              <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Open Pollinated</span>
            )}
          </p>
          {stats && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={stats.avgRating} size={18} />
              <span className="font-semibold text-stone-900">{stats.avgRating.toFixed(1)}</span>
              <span className="text-stone-500">({stats.reviewCount} {stats.reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        <Link
          to={`/review/new?cultivar=${cultivar.id}`}
          className="flex items-center gap-1.5 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shrink-0"
        >
          <PenSquare size={16} />
          Write a Review
        </Link>
      </div>

      {/* Quick stats panel */}
      {stats ? (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-900">{stats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-stone-500">Overall Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-900">{stats.reviewCount}</div>
              <div className="text-sm text-stone-500">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.wouldGrowAgainPct}%</div>
              <div className="text-sm text-stone-500">Would Grow Again</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-900">{cultivar.days_to_maturity}</div>
              <div className="text-sm text-stone-500">Days to Maturity</div>
            </div>
          </div>

          {stats.topAttributes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {stats.topAttributes.map(attr => (
                <span key={attr} className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
                  {attr}
                </span>
              ))}
            </div>
          )}

          {/* Ratings breakdown */}
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Ratings Breakdown</h3>
          <div className="space-y-3">
            <RatingBar label="Yield" value={stats.avgYield} />
            <RatingBar label="Flavor" value={stats.avgFlavor} />
            <RatingBar label="Disease Resistance" value={stats.avgDisease} />
            <RatingBar label="Heat Tolerance" value={stats.avgHeat} />
          </div>
          {!stats.avgYield && !stats.avgFlavor && !stats.avgDisease && !stats.avgHeat && (
            <p className="text-sm text-stone-400 italic">Need 3+ reviews to show breakdown</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8 text-center">
          <p className="text-stone-500 mb-2">No reviews yet for {cultivar.name}</p>
          <p className="text-sm text-stone-400">{cultivar.days_to_maturity} days to maturity &middot; {cultivar.open_pollinated ? 'Open Pollinated' : 'Hybrid'}</p>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          Reviews
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => {
              const reviewer = users.find(u => u.id === review.user_id);
              return (
                <div key={review.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:border-green-200 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {reviewer?.avatar || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-stone-900">{reviewer?.name || 'Unknown'}</div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span className="flex items-center gap-0.5">
                            <MapPin size={11} /> {reviewer?.county} County
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Thermometer size={11} /> Zone {reviewer?.zone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {review.year}
                      </span>
                      <span>{review.created_at}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={review.overall_rating} size={14} />
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      review.would_grow_again === 'Yes'
                        ? 'bg-green-50 text-green-700'
                        : review.would_grow_again === 'Maybe'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {review.would_grow_again === 'Yes' ? 'Would grow again' : review.would_grow_again === 'Maybe' ? 'Might grow again' : 'Would not grow again'}
                    </span>
                  </div>

                  {/* Sub-ratings */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm text-stone-500">
                    {review.yield_rating && <span>Yield: {'★'.repeat(review.yield_rating)}{'☆'.repeat(5 - review.yield_rating)}</span>}
                    {review.flavor_rating && <span>Flavor: {'★'.repeat(review.flavor_rating)}{'☆'.repeat(5 - review.flavor_rating)}</span>}
                    {review.disease_rating && <span>Disease: {'★'.repeat(review.disease_rating)}{'☆'.repeat(5 - review.disease_rating)}</span>}
                    {review.heat_rating && <span>Heat: {'★'.repeat(review.heat_rating)}{'☆'.repeat(5 - review.heat_rating)}</span>}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {review.start_method?.map(m => (
                      <span key={m} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{m}</span>
                    ))}
                    {review.location?.map(l => (
                      <span key={l} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{l}</span>
                    ))}
                  </div>

                  {review.notes && (
                    <p className="text-stone-900 text-sm leading-relaxed">{review.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
            <MessageSquare size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500 font-medium">Be the first to review {cultivar.name}</p>
            <Link
              to={`/review/new?cultivar=${cultivar.id}`}
              className="inline-flex items-center gap-1.5 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors mt-4"
            >
              <PenSquare size={16} />
              Write a Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
