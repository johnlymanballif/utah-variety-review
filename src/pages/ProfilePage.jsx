import { Link, Navigate } from 'react-router-dom';
import { MapPin, Thermometer, Sprout, Calendar, MessageSquare, PenSquare, ArrowRight } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { Avatar } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { cultivars, cropCategories } from '../data/cultivars';

function getCropImage(cropType) {
  const category = cropCategories.find(cat => cat.types.includes(cropType));
  return category?.image || '/crops/tomato.jpg';
}

export function ProfilePage() {
  const { currentUser, getReviewsForUser } = useApp();

  if (!currentUser) return <Navigate to="/login" />;

  const userReviews = getReviewsForUser(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="card overflow-hidden mb-8">
        {/* Cover image */}
        <div className="h-32 bg-gradient-to-r from-primary to-green-700" />
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            <div className="ring-4 ring-card rounded-full">
              <Avatar user={currentUser} size="lg" />
            </div>
            <div className="flex-1 sm:pb-2">
              <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {currentUser.county} County
                </span>
                <span className="flex items-center gap-1">
                  <Thermometer size={14} /> Zone {currentUser.zone}
                </span>
                <span className="flex items-center gap-1">
                  <Sprout size={14} /> {currentUser.growing_context}
                </span>
              </div>
            </div>
            <Link
              to="/review/new"
              className="btn-primary flex items-center gap-2"
            >
              <PenSquare size={16} />
              Write Review
            </Link>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
              <MessageSquare size={16} />
              <span className="font-semibold">{userReviews.length}</span>
              <span className="text-primary/70">{userReviews.length === 1 ? 'review' : 'reviews'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Your Reviews</h2>
      </div>

      {userReviews.length > 0 ? (
        <div className="space-y-4">
          {userReviews.map(review => {
            const cultivar = cultivars.find(c => c.id === review.cultivar_id);
            const cropImage = getCropImage(cultivar?.crop_type);
            
            return (
              <Link
                key={review.id}
                to={`/cultivar/${review.cultivar_id}`}
                className="group card overflow-hidden flex"
              >
                {/* Image */}
                <div className="w-24 sm:w-32 shrink-0 relative">
                  <img
                    src={cropImage}
                    alt={cultivar?.crop_type}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cultivar?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-muted-foreground">{cultivar?.crop_type} &middot; {cultivar?.crop_subtype}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating rating={review.overall_rating} size={14} />
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar size={13} /> {review.year}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        review.would_grow_again === 'Yes'
                          ? 'bg-primary/10 text-primary'
                          : review.would_grow_again === 'Maybe'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {review.would_grow_again}
                      </span>
                    </div>
                  </div>
                  {review.notes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{review.notes}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View details <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-muted mb-4" />
          <p className="text-lg font-medium text-foreground">No reviews yet</p>
          <p className="text-muted-foreground mt-2">Share your growing experience to help other Utah gardeners</p>
          <Link
            to="/review/new"
            className="inline-flex items-center gap-2 btn-primary mt-6"
          >
            <PenSquare size={16} />
            Write your first review
          </Link>
        </div>
      )}
    </div>
  );
}
