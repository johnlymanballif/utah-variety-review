import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cropCategories } from '../data/cultivars';

function getCropImage(cropType) {
  const category = cropCategories.find(cat => cat.types.includes(cropType));
  return category?.image || '/crops/tomato.jpg';
}

export function SearchBar({ className = '', autoFocus = false }) {
  const { searchCultivars } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchCultivars(query));
      setOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query, searchCultivars]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e) {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      goTo(results[selectedIndex].id);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function goTo(id) {
    setQuery('');
    setOpen(false);
    navigate(`/cultivar/${id}`);
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search varieties..."
          autoFocus={autoFocus}
          className="w-full pl-11 pr-10 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground shadow-sm transition-all"
          data-tour="search"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            {results.map((c, i) => {
              const cropImage = getCropImage(c.crop_type);
              return (
                <button
                  key={c.id}
                  onClick={() => goTo(c.id)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors ${
                    i === selectedIndex ? 'bg-primary/10' : 'hover:bg-secondary'
                  }`}
                >
                  <img
                    src={cropImage}
                    alt={c.crop_type}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground block truncate">{c.name}</span>
                    <span className="text-sm text-muted-foreground">{c.crop_type} &middot; {c.crop_subtype}</span>
                  </div>
                  <ArrowRight size={14} className={`text-muted-foreground shrink-0 ${i === selectedIndex ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 bg-secondary/50 border-t border-border text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-card rounded text-foreground font-mono">↑↓</kbd> to navigate,{' '}
            <kbd className="px-1.5 py-0.5 bg-card rounded text-foreground font-mono">Enter</kbd> to select
          </div>
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 p-6 text-center">
          <Search size={24} className="mx-auto text-muted mb-2" />
          <p className="text-sm text-muted-foreground">No varieties found for "{query}"</p>
          <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
