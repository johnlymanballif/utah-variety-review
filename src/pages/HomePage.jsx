import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, MapPin, Users, Leaf } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CultivarCard } from '../components/CultivarCard';
import { useApp } from '../context/AppContext';
import { cropCategories } from '../data/cultivars';

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-white/70">{label}</p>
      </div>
    </div>
  );
}

function CropCard({ category }) {
  return (
    <Link
      to={`/browse?crop=${encodeURIComponent(category.types[0])}`}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-card"
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-bold text-white text-lg">{category.name}</h3>
        <p className="text-sm text-white/70">{category.count} varieties</p>
      </div>
      <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity">
        {category.icon}
      </div>
    </Link>
  );
}

export function HomePage() {
  const { getFilteredCultivars, reviews } = useApp();

  const topRated = getFilteredCultivars({ minReviews: '5+', sortBy: 'rating' }).slice(0, 4);
  const recentlyReviewed = getFilteredCultivars({ minReviews: 'has_reviews', sortBy: 'reviews' }).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" data-tour="hero">
        <div className="absolute inset-0">
          <img
            src="/hero-garden.jpg"
            alt="Utah vegetable garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-800/90 to-green-900/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Leaf size={14} />
              Utah Gardening Community
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              What grows well in Utah?
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Real reviews from Utah gardeners. Find the varieties that thrive in your zone, from the mountains to the desert.
            </p>
            <SearchBar className="max-w-lg" autoFocus />
            
            <div className="grid grid-cols-3 gap-3 mt-10">
              <StatCard icon={Leaf} value="100+" label="Varieties" />
              <StatCard icon={Users} value="50+" label="Reviews" />
              <StatCard icon={MapPin} value="6" label="Regions" />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by crop */}
      <section className="max-w-7xl mx-auto px-4 py-12" data-tour="browse-crops">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Browse by Crop</h2>
            <p className="text-muted-foreground mt-1">Explore varieties by category</p>
          </div>
          <Link to="/browse" className="flex items-center gap-1 text-primary hover:text-green-700 font-medium transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cropCategories.map(cat => (
            <CropCard key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* Top rated */}
      {topRated.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Star size={20} className="text-accent-foreground fill-accent-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Top Rated Varieties</h2>
              <p className="text-sm text-muted-foreground">Highest rated with 5+ reviews</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRated.map(c => <CultivarCard key={c.id} cultivar={c} />)}
          </div>
        </section>
      )}

      {/* Most reviewed */}
      {recentlyReviewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Most Reviewed</h2>
              <p className="text-sm text-muted-foreground">Popular varieties with the most feedback</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyReviewed.map(c => <CultivarCard key={c.id} cultivar={c} />)}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-br from-primary to-green-700 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Share Your Growing Experience
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            Help other Utah gardeners by sharing what works in your garden. Your reviews make a difference!
          </p>
          <Link
            to="/review/new"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            Write a Review
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
