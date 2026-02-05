import { useNavigate } from 'react-router-dom';
import { MapPin, Thermometer, Sprout, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { users } from '../data/users';

export function LoginPage() {
  const { login, getReviewsForUser } = useApp();
  const navigate = useNavigate();

  function handleSelect(userId) {
    login(userId);
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout size={32} className="text-green-600" />
            <h1 className="text-2xl font-bold text-stone-900">Utah Variety Review</h1>
          </div>
          <p className="text-stone-500">Choose a demo persona to explore</p>
        </div>

        <div className="space-y-3">
          {users.map(user => {
            const count = getReviewsForUser(user.id).length;

            return (
              <button
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className="w-full bg-white rounded-xl border border-stone-200 p-4 text-left hover:border-green-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-lg font-bold group-hover:scale-105 transition-transform">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {user.county} County
                      </span>
                      <span className="flex items-center gap-1">
                        <Thermometer size={13} />
                        Zone {user.zone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sprout size={13} />
                        {user.growing_context}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={13} />
                        {count} {count === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                  {user.id === 'user-guest' && (
                    <span className="text-xs bg-stone-100 text-stone-400 px-2 py-1 rounded-full">Session only</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          This is a demo. Pick any persona to explore the app.
        </p>
      </div>
    </div>
  );
}
