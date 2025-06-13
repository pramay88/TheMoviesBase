import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Moviecard from './Moviecard';
import Pagination from './Pagination';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const searchInputRef = useRef(null);
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePrev = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (pageNo < totalPages) {
      setPageNo(pageNo + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      // Update the URL search params instead of navigating
      setSearchParams({ q: newQuery.trim() });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchInput);
    }
  };

  useEffect(() => {
    // Don't redirect if no query - just show empty state
    if (!query) {
      setMovies([]);
      setTotalResults(0);
      setTotalPages(0);
      return;
    }
    
    const searchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${pageNo}&include_adult=false`
        );
        
        setMovies(response.data.results || []);
        setTotalPages(Math.min(response.data.total_pages || 0, 500)); // TMDB limits to 500 pages
        setTotalResults(response.data.total_results || 0);
      } catch (err) {
        console.error('Error searching movies:', err);
        setError('Failed to search movies. Please try again.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query, pageNo]);

  // Reset page when query changes
  useEffect(() => {
    setPageNo(1);
    setSearchInput(query || '');
  }, [query]);

  // Show initial search state when no query
  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header with Search Bar */}
        <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title Section */}
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Search Movies
                </h1>
                <p className="text-gray-400">Find your favorite movies</p>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="relative max-w-md w-full">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Search for movies..."
                    className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 text-white placeholder-gray-400 px-5 py-3 pl-12 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                  <button
                    onClick={() => handleSearch(searchInput)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Go
                  </button>
                </div>
                {isSearchFocused && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Initial Search State */}
        <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
          <div className="text-8xl mb-8 animate-bounce">
            🔍
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">Start Your Search</h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md mx-auto">
            Enter a movie title above to discover amazing films from our vast collection.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
            >
              <span className="text-xl group-hover:animate-bounce">🏠</span>
              Browse Popular Movies
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
            >
              <span className="text-xl group-hover:animate-spin">🎭</span>
              Explore Categories
            </button>
          </div>

          {/* Search Suggestions */}
          <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <h3 className="text-white text-lg font-semibold mb-4">💡 Search Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">🎬</div>
                <p>Try movie titles</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <p>Search by genre</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📅</div>
                <p>Include release year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          /* Backdrop blur support */
          .backdrop-blur-xl {
            backdrop-filter: blur(24px);
          }
          
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
        `}</style>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          {/* Animated Loading Spinner */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-500/30 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin animate-reverse border-t-purple-500 mx-auto absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-white text-xl font-semibold">Searching Movies</h3>
            <p className="text-gray-400">Finding the perfect matches for "{query}"</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
          <div className="text-red-500 text-7xl mb-6 animate-bounce">
            ⚠️
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              🏠 Go Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header with Search Bar */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Search Results
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-400">
                <span>Results for:</span>
                <span className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-4 py-1.5 rounded-full font-medium border border-blue-500/20">
                  "{query}"
                </span>
              </div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="relative max-w-md w-full">
              <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search for movies..."
                  className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 text-white placeholder-gray-400 px-5 py-3 pl-12 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                <button
                  onClick={() => handleSearch(searchInput)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Go
                </button>
              </div>
              {isSearchFocused && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
              )}
            </div>
            
            {/* Results Counter */}
            {totalResults > 0 && (
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-white">
                  {totalResults.toLocaleString()}
                  <span className="text-gray-400 font-normal ml-2 text-sm">
                    {totalResults === 1 ? 'movie found' : 'movies found'}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Page {pageNo} of {totalPages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8">
        {movies.length === 0 ? (
          /* Enhanced No Results State */
          <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
            <div className="text-8xl mb-8 animate-bounce">
              🎬
            </div>
            <h2 className="text-white text-4xl font-bold mb-4">No Movies Found</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md mx-auto">
              We couldn't find any movies matching <span className="text-blue-400 font-semibold">"{query}"</span>. 
              Try different keywords or explore our popular collections.
            </p>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/')}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
              >
                <span className="text-xl group-hover:animate-bounce">🏠</span>
                Browse Popular Movies
              </button>
              <button
                onClick={() => navigate('/movies')}
                className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
              >
                <span className="text-xl group-hover:animate-spin">🎭</span>
                Explore Categories
              </button>
            </div>

            {/* Search Suggestions */}
            <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">💡 Search Tips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎬</div>
                  <p>Try movie titles</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <p>Search by genre</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <p>Include release year</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Movies Grid with Stagger Animation */
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 mb-12">
              {movies.map((movieObj, index) => (
                <div 
                  key={movieObj.id} 
                  className="w-full animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <div className="transform transition-all duration-300 hover:scale-105 hover:z-10 relative">
                    <Moviecard movieObj={movieObj} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center animate-fade-in">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-2">
                  <Pagination 
                    handlePrev={handlePrev} 
                    handleNext={handleNext} 
                    pageNo={pageNo}
                    totalPages={totalPages}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
        
        /* Smooth hover effects for cards */
        .hover\\:z-10:hover {
          z-index: 10;
        }
        
        /* Backdrop blur support */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}

export default SearchPage;