import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, X, Check, PenSquare, ArrowRight } from 'lucide-react';
import { StarPicker } from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { cultivars, cropCategories } from '../data/cultivars';

function getCropImage(cropType) {
  const category = cropCategories.find(cat => cat.types.includes(cropType));
  return category?.image || '/crops/tomato.jpg';
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-primary/10 text-primary border border-primary/30'
          : 'bg-secondary text-secondary-foreground border border-transparent hover:bg-muted'
      }`}
    >
      {active && <Check size={13} className="inline mr-1 -mt-0.5" />}
      {label}
    </button>
  );
}

export function ReviewFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, addReview, searchCultivars } = useApp();

  const preselectedId = searchParams.get('cultivar');
  const preselected = preselectedId ? cultivars.find(c => c.id === preselectedId) : null;

  const [cultivarSearch, setCultivarSearch] = useState(preselected?.name || '');
  const [selectedCultivar, setSelectedCultivar] = useState(preselected || null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const [year, setYear] = useState('2025');
  const [overallRating, setOverallRating] = useState(0);
  const [wouldGrowAgain, setWouldGrowAgain] = useState('');
  const [startMethod, setStartMethod] = useState([]);
  const [location, setLocation] = useState([]);
  const [yieldRating, setYieldRating] = useState(0);
  const [flavorRating, setFlavorRating] = useState(0);
  const [diseaseRating, setDiseaseRating] = useState(0);
  const [heatRating, setHeatRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;
  }, [currentUser]);

  useEffect(() => {
    if (cultivarSearch.trim().length >= 2 && !selectedCultivar) {
      setSearchResults(searchCultivars(cultivarSearch));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [cultivarSearch, selectedCultivar, searchCultivars]);

  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <PenSquare size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Sign in to write a review</h1>
        <p className="text-muted-foreground mb-6">Pick a demo persona to get started</p>
        <Link
          to="/login"
          className="btn-primary inline-flex items-center gap-2"
        >
          Choose Persona
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  function toggleArray(arr, setter, value) {
    setter(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedCultivar) { setError('Please select a variety'); return; }
    if (!overallRating) { setError('Please provide an overall rating'); return; }
    if (!wouldGrowAgain) { setError('Please indicate if you would grow again'); return; }

    const review = {
      user_id: currentUser.id,
      cultivar_id: selectedCultivar.id,
      year: Number(year),
      overall_rating: overallRating,
      would_grow_again: wouldGrowAgain,
      start_method: startMethod.length > 0 ? startMethod : undefined,
      location: location.length > 0 ? location : undefined,
      yield_rating: yieldRating || undefined,
      flavor_rating: flavorRating || undefined,
      disease_rating: diseaseRating || undefined,
      heat_rating: heatRating || undefined,
      notes: notes.trim() || undefined,
    };

    addReview(review);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Review submitted!</h1>
        <p className="text-muted-foreground mb-6">Thanks for sharing your experience with {selectedCultivar.name}.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to={`/cultivar/${selectedCultivar.id}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            View {selectedCultivar.name}
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedCultivar(null);
              setCultivarSearch('');
              setOverallRating(0);
              setWouldGrowAgain('');
              setStartMethod([]);
              setLocation([]);
              setYieldRating(0);
              setFlavorRating(0);
              setDiseaseRating(0);
              setHeatRating(0);
              setNotes('');
            }}
            className="btn-secondary"
          >
            Write another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Write a Review</h1>
      <p className="text-muted-foreground mb-6">Reviewing as {currentUser.name} &middot; {currentUser.county} County, Zone {currentUser.zone}</p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cultivar picker */}
        <div className="relative" ref={searchRef}>
          <label className="block text-sm font-medium text-foreground mb-2">
            Variety <span className="text-destructive">*</span>
          </label>
          {selectedCultivar ? (
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
              <img
                src={getCropImage(selectedCultivar.crop_type)}
                alt={selectedCultivar.crop_type}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <span className="font-medium text-foreground">{selectedCultivar.name}</span>
                <span className="text-sm text-muted-foreground ml-2">{selectedCultivar.crop_type}</span>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedCultivar(null); setCultivarSearch(''); }}
                className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={cultivarSearch}
                onChange={e => setCultivarSearch(e.target.value)}
                placeholder="Search for a variety..."
                className="input-field pl-11"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
                  {searchResults.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedCultivar(c); setCultivarSearch(c.name); setShowResults(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-secondary flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={getCropImage(c.crop_type)}
                        alt={c.crop_type}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-foreground">{c.name}</span>
                        <span className="text-sm text-muted-foreground block">{c.crop_type} &middot; {c.crop_subtype}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Growing Year <span className="text-destructive">*</span>
          </label>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="input-field"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Overall rating */}
        <div>
          <StarPicker
            value={overallRating}
            onChange={setOverallRating}
            label={<>Overall Rating <span className="text-destructive">*</span></>}
          />
        </div>

        {/* Would grow again */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Would you grow this again? <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            {['Yes', 'Maybe', 'No'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setWouldGrowAgain(opt)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  wouldGrowAgain === opt
                    ? opt === 'Yes' ? 'bg-primary/10 text-primary border border-primary/30'
                      : opt === 'Maybe' ? 'bg-accent text-accent-foreground border border-accent-foreground/20'
                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                    : 'bg-secondary text-secondary-foreground border border-transparent hover:bg-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Optional fields */}
        <p className="text-sm text-muted-foreground -mb-2">Optional details (help other gardeners!)</p>

        {/* Start method */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Start Method</label>
          <div className="flex flex-wrap gap-2">
            {['Direct seed', 'Transplant (home)', 'Transplant (purchased)'].map(m => (
              <Chip key={m} label={m} active={startMethod.includes(m)} onClick={() => toggleArray(startMethod, setStartMethod, m)} />
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Growing Location</label>
          <div className="flex flex-wrap gap-2">
            {['Outdoor', 'High tunnel', 'Greenhouse', 'Container'].map(l => (
              <Chip key={l} label={l} active={location.includes(l)} onClick={() => toggleArray(location, setLocation, l)} />
            ))}
          </div>
        </div>

        {/* Sub-ratings */}
        <div className="grid grid-cols-2 gap-4">
          <StarPicker value={yieldRating} onChange={setYieldRating} label="Yield" size={20} />
          <StarPicker value={flavorRating} onChange={setFlavorRating} label="Flavor" size={20} />
          <StarPicker value={diseaseRating} onChange={setDiseaseRating} label="Disease Resistance" size={20} />
          <StarPicker value={heatRating} onChange={setHeatRating} label="Heat Tolerance" size={20} />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Growing Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value.slice(0, 1000))}
            rows={4}
            placeholder="Share your experience growing this variety in Utah..."
            className="input-field resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{notes.length}/1000</p>
        </div>

        <button
          type="submit"
          className="w-full btn-primary py-3"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
