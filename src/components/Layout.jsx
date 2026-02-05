import { Link, useNavigate } from 'react-router-dom';
import { Sprout, PenSquare, User, LogOut, HelpCircle } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useApp } from '../context/AppContext';

export function Layout({ children }) {
  const { currentUser, logout, setTourActive, setTourStep } = useApp();
  const navigate = useNavigate();

  function startTour() {
    setTourStep(0);
    setTourActive(true);
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0" data-tour="logo">
            <Sprout size={24} className="text-green-600" />
            <span className="font-bold text-lg hidden sm:inline text-stone-900">Utah Variety Review</span>
            <span className="font-bold text-lg sm:hidden text-stone-900">UVR</span>
          </Link>

          <SearchBar className="flex-1 max-w-md" />

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={startTour}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="Quick tour"
            >
              <HelpCircle size={20} />
            </button>

            <Link
              to="/review/new"
              className="hidden sm:flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              data-tour="write-review"
            >
              <PenSquare size={16} />
              Write a Review
            </Link>
            <Link
              to="/review/new"
              className="sm:hidden flex items-center justify-center bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <PenSquare size={18} />
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                  data-tour="profile"
                >
                  <div className="w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {currentUser.avatar}
                  </div>
                  <span className="text-sm font-medium hidden md:inline">{currentUser.name}</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Switch persona"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                <User size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-stone-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-stone-500">
          <p>Utah Variety Review — Demo</p>
          <p className="mt-1">Helping Utah gardeners find varieties that thrive</p>
        </div>
      </footer>
    </div>
  );
}
