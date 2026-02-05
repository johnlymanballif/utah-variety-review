import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, PenSquare, User, LogOut, HelpCircle, Menu, X, Home, Grid3X3, ChevronDown } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useApp } from '../context/AppContext';

function Avatar({ user, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold ring-2 ring-white`}>
      {user?.avatar || '?'}
    </div>
  );
}

export function Layout({ children }) {
  const { currentUser, logout, setTourActive, setTourStep } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function startTour() {
    setTourStep(0);
    setTourActive(true);
    navigate('/');
    setMobileMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Nav */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 shrink-0" data-tour="logo">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout size={22} className="text-primary-foreground" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-foreground">Utah Variety</span>
                  <span className="text-muted-foreground font-medium ml-1">Review</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <NavLink to="/" className={navLinkClass} end>
                  <Home size={16} />
                  Home
                </NavLink>
                <NavLink to="/browse" className={navLinkClass}>
                  <Grid3X3 size={16} />
                  Browse
                </NavLink>
              </nav>
            </div>

            {/* Search */}
            <SearchBar className="hidden sm:block flex-1 max-w-md mx-4" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={startTour}
                className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                title="Quick tour"
              >
                <HelpCircle size={20} />
              </button>

              <Link
                to="/review/new"
                className="hidden sm:flex items-center gap-1.5 btn-primary"
                data-tour="write-review"
              >
                <PenSquare size={16} />
                <span>Write Review</span>
              </Link>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                    data-tour="profile"
                  >
                    <Avatar user={currentUser} size="sm" />
                    <span className="hidden lg:block text-sm font-medium text-foreground">{currentUser.name}</span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden">
                        <div className="p-3 border-b border-border">
                          <div className="flex items-center gap-3">
                            <Avatar user={currentUser} size="md" />
                            <div>
                              <p className="font-medium text-foreground">{currentUser.name}</p>
                              <p className="text-xs text-muted-foreground">{currentUser.county} County</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-1">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                          >
                            <User size={16} />
                            Your Profile
                          </Link>
                          <Link
                            to="/review/new"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                          >
                            <PenSquare size={16} />
                            Write a Review
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                              navigate('/login');
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <LogOut size={16} />
                            Switch Persona
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 btn-secondary"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-3">
            <SearchBar className="w-full" />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              <NavLink
                to="/"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
                end
              >
                <Home size={18} />
                Home
              </NavLink>
              <NavLink
                to="/browse"
                className={navLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Grid3X3 size={18} />
                Browse Varieties
              </NavLink>
              <Link
                to="/review/new"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PenSquare size={18} />
                Write a Review
              </Link>
              <button
                onClick={startTour}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <HelpCircle size={18} />
                Take a Tour
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sprout size={18} className="text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Utah Variety Review</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Helping Utah gardeners find varieties that thrive in our unique climate
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
              <button onClick={startTour} className="hover:text-foreground transition-colors">Tour</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { Avatar };
