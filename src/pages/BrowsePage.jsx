import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { CultivarCard } from '../components/CultivarCard';
import { useApp } from '../context/AppContext';
import { cropCategories, regions } from '../data/cultivars';

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredCultivars } = useApp();
  const [showFilters, setShowFilters] = useState(false);

  const initialCrop = searchParams.get('crop');
  const [selectedCrops, setSelectedCrops] = useState(initialCrop ? [initialCrop] : []);
  const [region, setRegion] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minReviews, setMinReviews] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const results = useMemo(() => {
    return getFilteredCultivars({
      cropTypes: selectedCrops.length > 0 ? selectedCrops : undefined,
      region: region || undefined,
      minRating: minRating ? Number(minRating) : undefined,
      minReviews: minReviews || undefined,
      sortBy,
    });
  }, [selectedCrops, region, minRating, minReviews, sortBy, getFilteredCultivars]);

  function toggleCrop(cropType) {
    setSelectedCrops(prev =>
      prev.includes(cropType) ? prev.filter(c => c !== cropType) : [...prev, cropType]
    );
  }

  function clearFilters() {
    setSelectedCrops([]);
    setRegion('');
    setMinRating('');
    setMinReviews('');
    setSearchParams({});
  }

  const hasFilters = selectedCrops.length > 0 || region || minRating || minReviews;

  const filterPanel = (
    <div className="space-y-6">
      {/* Crop type */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-2">Crop Type</h3>
        <div className="flex flex-wrap gap-2">
          {cropCategories.map(cat => {
            const isActive = cat.types.some(t => selectedCrops.includes(t));
            return (
              <button
                key={cat.name}
                onClick={() => {
                  cat.types.forEach(t => {
                    if (isActive) {
                      setSelectedCrops(prev => prev.filter(c => !cat.types.includes(c)));
                    } else {
                      setSelectedCrops(prev => [...new Set([...prev, ...cat.types])]);
                    }
                  });
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-stone-100 text-stone-600 border border-transparent hover:bg-stone-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-2">Region</h3>
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
        >
          <option value="">All regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Min rating */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-2">Minimum Rating</h3>
        <select
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
        >
          <option value="">Any rating</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
        </select>
      </div>

      {/* Review count */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 mb-2">Reviews</h3>
        <select
          value={minReviews}
          onChange={e => setMinReviews(e.target.value)}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white text-stone-900 focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
        >
          <option value="">Any</option>
          <option value="has_reviews">Has reviews</option>
          <option value="5+">5+ reviews</option>
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Browse Varieties</h1>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white text-stone-900"
          >
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Reviews</option>
            <option value="name">Sort by Name</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-stone-300 rounded-lg text-sm hover:bg-stone-50 text-stone-900"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-green-600 rounded-full" />}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          {filterPanel}
        </aside>

        {/* Mobile filter sheet */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-stone-900">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-stone-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        )}

        {/* Results grid */}
        <div className="flex-1">
          <p className="text-sm text-stone-500 mb-4">{results.length} varieties</p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(c => <CultivarCard key={c.id} cultivar={c} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-500">
              <p className="text-lg font-medium">No varieties match your filters</p>
              <p className="mt-1 text-stone-400">Try adjusting your search criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
