import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';
import { CultivarCard } from '../components/CultivarCard';
import { useApp } from '../context/AppContext';
import { cropCategories, regions } from '../data/cultivars';

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-secondary text-secondary-foreground hover:bg-muted'
      }`}
    >
      {children}
    </button>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input-field appearance-none pr-10"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

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
        <h3 className="text-sm font-semibold text-foreground mb-3">Crop Type</h3>
        <div className="flex flex-wrap gap-2">
          {cropCategories.map(cat => {
            const isActive = cat.types.some(t => selectedCrops.includes(t));
            return (
              <FilterChip
                key={cat.name}
                active={isActive}
                onClick={() => {
                  cat.types.forEach(t => {
                    if (isActive) {
                      setSelectedCrops(prev => prev.filter(c => !cat.types.includes(c)));
                    } else {
                      setSelectedCrops(prev => [...new Set([...prev, ...cat.types])]);
                    }
                  });
                }}
              >
                <span className="mr-1">{cat.icon}</span> {cat.name}
              </FilterChip>
            );
          })}
        </div>
      </div>

      {/* Region */}
      <SelectField
        label="Region"
        value={region}
        onChange={setRegion}
        placeholder="All regions"
        options={regions.map(r => ({ value: r, label: r }))}
      />

      {/* Min rating */}
      <SelectField
        label="Minimum Rating"
        value={minRating}
        onChange={setMinRating}
        placeholder="Any rating"
        options={[
          { value: '3', label: '3+ stars' },
          { value: '4', label: '4+ stars' },
        ]}
      />

      {/* Review count */}
      <SelectField
        label="Reviews"
        value={minReviews}
        onChange={setMinReviews}
        placeholder="Any"
        options={[
          { value: 'has_reviews', label: 'Has reviews' },
          { value: '5+', label: '5+ reviews' },
        ]}
      />

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-sm text-destructive hover:text-red-700 font-medium transition-colors"
        >
          <X size={14} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Browse Varieties</h1>
          <p className="text-muted-foreground mt-1">Discover varieties that thrive in Utah</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input-field pr-10 text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
              <option value="name">Sort by Name</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showFilters || hasFilters ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && !showFilters && (
              <span className="w-2 h-2 bg-white rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={18} className="text-primary" />
              <h2 className="font-semibold text-foreground">Filters</h2>
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Mobile filter sheet */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-6 btn-primary py-3"
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        )}

        {/* Results grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'variety' : 'varieties'}
              {hasFilters && ' matching filters'}
            </p>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.map(c => <CultivarCard key={c.id} cultivar={c} />)}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Grid3X3 size={48} className="mx-auto text-muted mb-4" />
              <p className="text-lg font-medium text-foreground">No varieties match your filters</p>
              <p className="mt-2 text-muted-foreground">Try adjusting your search criteria</p>
              <button
                onClick={clearFilters}
                className="mt-6 btn-primary"
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
