import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

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
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search varieties..."
          autoFocus={autoFocus}
          className="w-full pl-10 pr-8 py-2.5 bg-white border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder:text-stone-400"
          data-tour="search"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.map((c, i) => (
            <button
              key={c.id}
              onClick={() => goTo(c.id)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-stone-50 ${i === selectedIndex ? 'bg-green-50' : ''}`}
            >
              <span className="font-medium text-stone-900">{c.name}</span>
              <span className="text-sm text-stone-500">{c.crop_type}</span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 p-4 text-sm text-stone-500">
          No varieties found for "{query}"
        </div>
      )}
    </div>
  );
}
