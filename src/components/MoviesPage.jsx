import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Moviecard from './Moviecard';
import Pagination from './Pagination';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MOVIE_CATEGORIES = [
  {
    id: 'popular',
    name: 'Popular',
    endpoint: 'popular',
    icon: 'fa-fire',
    color: 'from-orange-500 to-red-500',
    description: 'Most popular movies right now'
  },
  {
    id: 'now_playing',
    name: 'Now Playing',
    endpoint: 'now_playing',
    icon: 'fa-play-circle',
    color: 'from-blue-500 to-purple-500',
    description: 'Currently in theaters'
  },
  {
    id: 'top_rated',
    name: 'Top Rated',
    endpoint: 'top_rated',
    icon: 'fa-star',
    color: 'from-yellow-500 to-orange-500',
    description: 'Highest rated movies of all time'
  },
  {
    id: 'upcoming',
    name: 'Upcoming',
    endpoint: 'upcoming',
    icon: 'fa-calendar',
    color: 'from-green-500 to-blue-500',
    description: 'Coming soon to theaters'
  }
];

const MoviesPage= () =>  {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [error, setError] = useState(null);

  const handlePrev = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNext = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setPageNo(1);
  };

  const handleRetry = () => {
    setError(null);
    setPageNo(1);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${activeCategory}?api_key=${API_KEY}&language=en-US&page=${pageNo}`
        );
        
        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 0);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    if (API_KEY) {
      fetchMovies();
    } else {
      setError('API key is missing. Please check your environment configuration.');
    }
  }, [activeCategory, pageNo]);

  const currentCategory = MOVIE_CATEGORIES.find(cat => cat.id === activeCategory);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fa-solid fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Loading Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 mr-3"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-3 py-5 sm:px-5">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Discover Movies
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore thousands of movies across different categories and find your next favorite film
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {MOVIE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`
                group relative overflow-hidden rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base
                transition-all duration-300 transform hover:scale-105 active:scale-95
                ${activeCategory === category.id
                  ? 'text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50'
                }
              `}
            >
              {/* Background gradient for active tab */}
              {activeCategory === category.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-90`}></div>
              )}
              
              {/* Content */}
              <div className="relative flex items-center gap-2 sm:gap-3">
                <i className={`fa-solid ${category.icon} text-lg sm:text-xl`}></i>
                <div className="text-left">
                  <div className="font-bold">{category.name}</div>
                  <div className="text-xs opacity-80 hidden sm:block">
                    {category.description}
                  </div>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            </button>
          ))}
        </div>

        {/* Current Category Info */}
        {currentCategory && (
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${currentCategory.color} bg-opacity-20 border border-white/10`}>
              <i className={`fa-solid ${currentCategory.icon} text-xl`}></i>
              <div>
                <h2 className="text-white text-xl font-bold">{currentCategory.name}</h2>
                <p className="text-gray-300 text-sm">{currentCategory.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading movies...</p>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && movies.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8 sm:mb-10">
            {movies.map((movieObj) => (
              <div key={movieObj.id} className="w-full">
                <Moviecard movieObj={movieObj} />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-2 sm:px-0">
              <Pagination 
                handlePrev={handlePrev} 
                handleNext={handleNext} 
                pageNo={pageNo}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && !error && (
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="text-gray-500 text-8xl mb-6">
            <i className="fa-solid fa-film"></i>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">No Movies Found</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            We couldn't load movies for this category right now. Please try again later.
          </p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Refresh Movies
          </button>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;