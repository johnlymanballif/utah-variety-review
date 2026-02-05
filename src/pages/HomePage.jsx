import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CultivarCard } from '../components/CultivarCard';
import { useApp } from '../context/AppContext';
import { cropCategories } from '../data/cultivars';

export function HomePage() {
  const { getFilteredCultivars } = useApp();

  const topRated = getFilteredCultivars({ minReviews: '5+', sortBy: 'rating' }).slice(0, 4);
  const recentlyReviewed = getFilteredCultivars({ minReviews: 'has_reviews', sortBy: 'reviews' }).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-12 sm:py-16" data-tour="hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            What grows well in Utah?
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-green-100">
            Real reviews from Utah gardeners. Find the varieties that thrive in your zone.
          </p>
          <SearchBar className="max-w-lg mx-auto" autoFocus />
        </div>
      </section>

      {/* Browse by crop */}
      <section className="max-w-6xl mx-auto px-4 py-10" data-tour="browse-crops">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">Browse by Crop</h2>
          <Link to="/browse" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 font-medium">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cropCategories.map(cat => (
            <Link
              key={cat.name}
              to={`/browse?crop=${encodeURIComponent(cat.types[0])}`}
              className="bg-white rounded-xl border border-stone-200 p-4 text-center hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-stone-900">{cat.name}</h3>
              <p className="text-sm text-stone-500">{cat.count} varieties</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top rated */}
      {topRated.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-bold text-stone-900">Top Rated Varieties</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRated.map(c => <CultivarCard key={c.id} cultivar={c} />)}
          </div>
        </section>
      )}

      {/* Most reviewed */}
      {recentlyReviewed.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-green-600" />
            <h2 className="text-xl font-bold text-stone-900">Most Reviewed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyReviewed.map(c => <CultivarCard key={c.id} cultivar={c} />)}
          </div>
        </section>
      )}
    </div>
  );
}
