import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { users } from '../data/users';
import { cultivars, getRegionForCounty } from '../data/cultivars';
import { seedReviews } from '../data/reviews';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [reviews, setReviews] = useState(seedReviews);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const login = useCallback((userId) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addReview = useCallback((review) => {
    const newReview = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  }, []);

  const getReviewsForCultivar = useCallback((cultivarId) => {
    return reviews.filter(r => r.cultivar_id === cultivarId);
  }, [reviews]);

  const getReviewsForUser = useCallback((userId) => {
    return reviews.filter(r => r.user_id === userId);
  }, [reviews]);

  const getCultivarStats = useCallback((cultivarId) => {
    const cvReviews = reviews.filter(r => r.cultivar_id === cultivarId);
    if (cvReviews.length === 0) return null;

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const overallRatings = cvReviews.map(r => r.overall_rating);
    const yieldRatings = cvReviews.filter(r => r.yield_rating).map(r => r.yield_rating);
    const flavorRatings = cvReviews.filter(r => r.flavor_rating).map(r => r.flavor_rating);
    const diseaseRatings = cvReviews.filter(r => r.disease_rating).map(r => r.disease_rating);
    const heatRatings = cvReviews.filter(r => r.heat_rating).map(r => r.heat_rating);
    const wouldGrowAgain = cvReviews.filter(r => r.would_grow_again === 'Yes').length;

    const topAttributes = [];
    if (flavorRatings.length >= 3 && avg(flavorRatings) >= 4) topAttributes.push('Great flavor');
    if (yieldRatings.length >= 3 && avg(yieldRatings) >= 4) topAttributes.push('High yield');
    if (diseaseRatings.length >= 3 && avg(diseaseRatings) >= 4) topAttributes.push('Disease resistant');
    if (heatRatings.length >= 3 && avg(heatRatings) >= 4) topAttributes.push('Heat tolerant');

    return {
      reviewCount: cvReviews.length,
      avgRating: avg(overallRatings),
      wouldGrowAgainPct: Math.round((wouldGrowAgain / cvReviews.length) * 100),
      avgYield: yieldRatings.length >= 3 ? avg(yieldRatings) : null,
      avgFlavor: flavorRatings.length >= 3 ? avg(flavorRatings) : null,
      avgDisease: diseaseRatings.length >= 3 ? avg(diseaseRatings) : null,
      avgHeat: heatRatings.length >= 3 ? avg(heatRatings) : null,
      topAttributes,
    };
  }, [reviews]);

  const searchCultivars = useCallback((query) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return cultivars.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.crop_type.toLowerCase().includes(q) ||
      c.crop_subtype.toLowerCase().includes(q)
    ).slice(0, 10);
  }, []);

  const getFilteredCultivars = useCallback(({ cropTypes: filterCropTypes, region, minRating, growingContext, minReviews, sortBy = 'rating' }) => {
    let results = [...cultivars];

    if (filterCropTypes && filterCropTypes.length > 0) {
      results = results.filter(c => filterCropTypes.includes(c.crop_type));
    }

    return results.map(c => {
      const stats = getCultivarStats(c.id);
      const cvReviews = reviews.filter(r => r.cultivar_id === c.id);

      let regionMatch = true;
      if (region) {
        const reviewUsers = cvReviews.map(r => users.find(u => u.id === r.user_id)).filter(Boolean);
        regionMatch = reviewUsers.some(u => getRegionForCounty(u.county) === region) || cvReviews.length === 0;
      }

      return { ...c, stats, regionMatch };
    })
    .filter(c => {
      if (!c.regionMatch) return false;
      if (minRating && c.stats && c.stats.avgRating < minRating) return false;
      if (minRating && !c.stats) return false;
      if (minReviews === 'has_reviews' && (!c.stats || c.stats.reviewCount === 0)) return false;
      if (minReviews === '5+' && (!c.stats || c.stats.reviewCount < 5)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        const aRating = a.stats?.avgRating || 0;
        const bRating = b.stats?.avgRating || 0;
        return bRating - aRating;
      }
      if (sortBy === 'reviews') {
        const aCount = a.stats?.reviewCount || 0;
        const bCount = b.stats?.reviewCount || 0;
        return bCount - aCount;
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [getCultivarStats, reviews]);

  const value = useMemo(() => ({
    currentUser,
    users,
    cultivars,
    reviews,
    login,
    logout,
    addReview,
    getReviewsForCultivar,
    getReviewsForUser,
    getCultivarStats,
    searchCultivars,
    getFilteredCultivars,
    tourActive,
    setTourActive,
    tourStep,
    setTourStep,
  }), [currentUser, reviews, login, logout, addReview, getReviewsForCultivar, getReviewsForUser, getCultivarStats, searchCultivars, getFilteredCultivars, tourActive, tourStep]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
