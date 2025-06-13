import { useEffect, useState } from 'react';
import Moviecard from './Moviecard'
import axios from 'axios'
import Pagination from './Pagination';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 

function Movies({handleAddToWatchlist, handleRemoveFromWatchlist, watchlist}){
    const isLocal = import.meta.env.DEV;

    const [movies, setMovies] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePrev = () => {
        if(pageNo > 1) {
            setPageNo(pageNo - 1);
        }
    }
    
    const handleNext = () => {
        if(pageNo < totalPages) {
            setPageNo(pageNo + 1);
        }
    }

    const handleRetry = () => {
        setError(null);
        setPageNo(1);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const fetchUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNo}`;
                const response = await axios.get(fetchUrl);
                
                setMovies(response.data.results || []);
                setTotalPages(response.data.total_pages || 0);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load trending movies. Please try again.');
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
    }, [pageNo]);

    // Error State
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
        <div className='px-3 py-5 sm:px-5'>
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Trending Movies
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover the most popular movies right now and add them to your watchlist
                    </p>
                </div>

                {/* Trending Badge */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 bg-opacity-20 border border-white/10">
                        <i className="fa-solid fa-fire text-xl text-orange-400"></i>
                        <div>
                            <h2 className="text-white text-xl font-bold">Popular Movies</h2>
                            <p className="text-gray-300 text-sm">Most trending movies worldwide</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-white text-lg">Loading trending movies...</p>
                    </div>
                </div>
            )}

            {/* Movies Grid */}
            {!loading && movies.length > 0 && (
                <div className="max-w-7xl mx-auto">
                    <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-8 sm:mb-10'>
                        {movies.map((movieObj) => (
                            <div key={movieObj.id} className="w-full">
                                <Moviecard 
                                    movieObj={movieObj} 
                                    handleAddToWatchlist={handleAddToWatchlist}
                                    handleRemoveFromWatchlist={handleRemoveFromWatchlist}
                                    watchlist={watchlist}
                                />
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
                        We couldn't load trending movies right now. Please try again later.
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

export default Movies;