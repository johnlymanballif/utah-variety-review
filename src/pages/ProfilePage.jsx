import { Link, Navigate } from 'react-router-dom';
import { MapPin, Thermometer, Sprout, Calendar, MessageSquare } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { cultivars } from '../data/cultivars';

export function ProfilePage() {
  const { currentUser, getReviewsForUser } = useApp();

  if (!currentUser) return <Navigate to="/login" />;

  const userReviews = getReviewsForUser(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl font-bold">
            {currentUser.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">{currentUser.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-stone-500">
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
        </div>

        <div className="mt-4 pt-4 border-t border-stone-200">
          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <MessageSquare size={14} />
            {userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-lg font-bold text-stone-900 mb-4">Your Reviews</h2>

      {userReviews.length > 0 ? (
        <div className="space-y-3">
          {userReviews.map(review => {
            const cultivar = cultivars.find(c => c.id === review.cultivar_id);
            return (
              <Link
                key={review.id}
                to={`/cultivar/${review.cultivar_id}`}
                className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-stone-900">{cultivar?.name || 'Unknown'}</h3>
                    <p className="text-sm text-stone-500">{cultivar?.crop_type} &middot; {cultivar?.crop_subtype}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.overall_rating} size={14} />
                    <span className="flex items-center gap-1 text-sm text-stone-500">
                      <Calendar size={13} /> {review.year}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      review.would_grow_again === 'Yes'
                        ? 'bg-green-50 text-green-700'
                        : review.would_grow_again === 'Maybe'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {review.would_grow_again}
                    </span>
                  </div>
                </div>
                {review.notes && (
                  <p className="text-sm text-stone-500 mt-2 line-clamp-2">{review.notes}</p>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
          <p className="text-stone-500">No reviews yet</p>
          <Link
            to="/review/new"
            className="inline-block mt-4 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Write your first review
          </Link>
        </div>
      )}
    </div>
  );
}
