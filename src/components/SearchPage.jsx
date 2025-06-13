import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Moviecard from './Moviecard';
import Pagination from './Pagination';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
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

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }
    
    const searchMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${pageNo}`
        );
        
        setMovies(response.data.results || []);
        setTotalPages(response.data.total_pages || 0);
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
  }, [query, pageNo, navigate]);

  // Reset page when query changes
  useEffect(() => {
    setPageNo(1);
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Searching movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fa-solid fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Search Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-3 py-5 sm:px-5">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Search Results
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-400">
              <span>Showing results for:</span>
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full font-medium">
                "{query}"
              </span>
            </div>
          </div>
          
          {totalResults > 0 && (
            <div className="text-right">
              <p className="text-lg font-semibold text-white">
                {totalResults.toLocaleString()} 
                <span className="text-gray-400 font-normal ml-1">
                  {totalResults === 1 ? 'result' : 'results'}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Page {pageNo} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {movies.length === 0 ? (
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="text-gray-500 text-8xl mb-6">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <h2 className="text-white text-3xl font-bold mb-4">No Movies Found</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            We couldn't find any movies matching "{query}". Try searching with different keywords.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 mr-4"
            >
              Browse Popular Movies
            </button>
            <button
              onClick={() => navigate('/movies')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Explore Categories
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Movies Grid */}
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
        </>
      )}
    </div>
  );
}

export default SearchPage;