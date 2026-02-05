import { useNavigate } from 'react-router-dom';
import { MapPin, Thermometer, Sprout, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { users } from '../data/users';

function Avatar({ user, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-card shadow-md`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold ring-2 ring-card shadow-md`}>
      {user?.avatar || '?'}
    </div>
  );
}

export function LoginPage() {
  const { login, getReviewsForUser } = useApp();
  const navigate = useNavigate();

  function handleSelect(userId) {
    login(userId);
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sprout size={28} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Utah Variety Review</h1>
          <p className="text-muted-foreground mt-2">Choose a demo persona to explore</p>
        </div>

        <div className="space-y-3">
          {users.map(user => {
            const count = getReviewsForUser(user.id).length;

            return (
              <button
                key={user.id}
                onClick={() => handleSelect(user.id)}
                className="w-full card p-4 text-left hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Avatar user={user} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
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
                  <div className="flex items-center gap-2 shrink-0">
                    {user.id === 'user-guest' && (
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">Session only</span>
                    )}
                    <ArrowRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          This is a demo. Pick any persona to explore the app.
        </p>
      </div>
    </div>
  );
}
