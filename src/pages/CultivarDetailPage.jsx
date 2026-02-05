import { useParams, Link } from 'react-router-dom';
import { PenSquare, ChevronRight, ThumbsUp, MessageSquare, MapPin, Thermometer, Calendar, Clock, Leaf, ArrowLeft } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { Avatar } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { cultivars, cropCategories } from '../data/cultivars';
import { users } from '../data/users';

function getCropImage(cropType) {
  const category = cropCategories.find(cat => cat.types.includes(cropType));
  return category?.image || '/crops/tomato.jpg';
}

function RatingBar({ label, value }) {
  if (value === null) return null;
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-foreground w-8 text-right">{value.toFixed(1)}</span>
    </div>
  );
}

function StatBox({ value, label, highlight = false }) {
  return (
    <div className={`text-center p-4 rounded-xl ${highlight ? 'bg-primary/10' : 'bg-secondary'}`}>
      <div className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export function CultivarDetailPage() {
  const { id } = useParams();
  const { getCultivarStats, getReviewsForCultivar } = useApp();

  const cultivar = cultivars.find(c => c.id === id);
  if (!cultivar) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Variety not found</h1>
        <Link to="/browse" className="text-primary hover:text-green-700 mt-4 inline-block">Browse varieties</Link>
      </div>
    );
  }

  const stats = getCultivarStats(cultivar.id);
  const reviews = getReviewsForCultivar(cultivar.id);
  const cropImage = getCropImage(cultivar.crop_type);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Browse
      </Link>

      {/* Header with image */}
      <div className="card overflow-hidden mb-8">
        <div className="relative h-48 sm:h-64">
          <img
            src={cropImage}
            alt={cultivar.crop_type}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Breadcrumb */}
          <nav className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white/70">
            <Link to="/browse" className="hover:text-white">Browse</Link>
            <ChevronRight size={14} />
            <Link
              to={`/browse?crop=${encodeURIComponent(cultivar.crop_type)}`}
              className="hover:text-white"
            >
              {cultivar.crop_type}
            </Link>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{cultivar.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-white/80">
                  <span>{cultivar.crop_type}</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full" />
                  <span>{cultivar.crop_subtype}</span>
                  {cultivar.open_pollinated && (
                    <>
                      <span className="w-1 h-1 bg-white/50 rounded-full" />
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                        Open Pollinated
                      </span>
                    </>
                  )}
                </div>
                {stats && (
                  <div className="flex items-center gap-2 mt-3">
                    <StarRating rating={stats.avgRating} size={18} />
                    <span className="font-semibold text-white">{stats.avgRating.toFixed(1)}</span>
                    <span className="text-white/70">({stats.reviewCount} {stats.reviewCount === 1 ? 'review' : 'reviews'})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Link
            to={`/review/new?cultivar=${cultivar.id}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <PenSquare size={16} />
            Write a Review
          </Link>
        </div>
      </div>

      {/* Stats Panel */}
      {stats ? (
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatBox value={stats.avgRating.toFixed(1)} label="Overall Rating" />
            <StatBox value={stats.reviewCount} label="Reviews" />
            <StatBox value={`${stats.wouldGrowAgainPct}%`} label="Would Grow Again" highlight />
            <StatBox value={cultivar.days_to_maturity} label="Days to Maturity" />
          </div>

          {stats.topAttributes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {stats.topAttributes.map(attr => (
                <span key={attr} className="text-sm bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-medium">
                  {attr}
                </span>
              ))}
            </div>
          )}

          {/* Ratings breakdown */}
          <h3 className="text-sm font-semibold text-foreground mb-4">Ratings Breakdown</h3>
          <div className="space-y-3">
            <RatingBar label="Yield" value={stats.avgYield} />
            <RatingBar label="Flavor" value={stats.avgFlavor} />
            <RatingBar label="Disease Resistance" value={stats.avgDisease} />
            <RatingBar label="Heat Tolerance" value={stats.avgHeat} />
          </div>
          {!stats.avgYield && !stats.avgFlavor && !stats.avgDisease && !stats.avgHeat && (
            <p className="text-sm text-muted-foreground italic mt-2">Need 3+ reviews to show breakdown</p>
          )}
        </div>
      ) : (
        <div className="card p-8 mb-8 text-center">
          <Leaf size={40} className="mx-auto text-muted mb-3" />
          <p className="text-muted-foreground mb-2">No reviews yet for {cultivar.name}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {cultivar.days_to_maturity} days to maturity
            </span>
            <span>{cultivar.open_pollinated ? 'Open Pollinated' : 'Hybrid'}</span>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">Reviews</h2>
          {reviews.length > 0 && (
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => {
              const reviewer = users.find(u => u.id === review.user_id);
              return (
                <div key={review.id} className="card p-5 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={reviewer} size="md" />
                      <div>
                        <div className="font-medium text-foreground">{reviewer?.name || 'Unknown'}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {reviewer?.county} County
                          </span>
                          <span className="flex items-center gap-1">
                            <Thermometer size={11} /> Zone {reviewer?.zone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {review.year}
                      </span>
                      <span className="text-xs">{review.created_at}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <StarRating rating={review.overall_rating} size={14} />
                    <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                      review.would_grow_again === 'Yes'
                        ? 'bg-primary/10 text-primary'
                        : review.would_grow_again === 'Maybe'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {review.would_grow_again === 'Yes' ? 'Would grow again' : review.would_grow_again === 'Maybe' ? 'Might grow again' : 'Would not grow again'}
                    </span>
                  </div>

                  {/* Sub-ratings */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-sm text-muted-foreground">
                    {review.yield_rating && <span>Yield: {'★'.repeat(review.yield_rating)}{'☆'.repeat(5 - review.yield_rating)}</span>}
                    {review.flavor_rating && <span>Flavor: {'★'.repeat(review.flavor_rating)}{'☆'.repeat(5 - review.flavor_rating)}</span>}
                    {review.disease_rating && <span>Disease: {'★'.repeat(review.disease_rating)}{'☆'.repeat(5 - review.disease_rating)}</span>}
                    {review.heat_rating && <span>Heat: {'★'.repeat(review.heat_rating)}{'☆'.repeat(5 - review.heat_rating)}</span>}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {review.start_method?.map(m => (
                      <span key={m} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{m}</span>
                    ))}
                    {review.location?.map(l => (
                      <span key={l} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{l}</span>
                    ))}
                  </div>

                  {review.notes && (
                    <p className="text-foreground text-sm leading-relaxed">{review.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <MessageSquare size={40} className="mx-auto text-muted mb-3" />
            <p className="text-muted-foreground font-medium mb-2">Be the first to review {cultivar.name}</p>
            <p className="text-sm text-muted-foreground mb-4">Share your experience to help other Utah gardeners</p>
            <Link
              to={`/review/new?cultivar=${cultivar.id}`}
              className="btn-primary inline-flex items-center gap-2"
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
