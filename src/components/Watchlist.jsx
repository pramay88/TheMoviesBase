import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import genreId from '../utility/genre';
import { useAuth } from "../context/authContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedWatchlist, setSortedWatchlist] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [genreList, setGenreList] = useState([]);
  const [genreFilter, setGenreFilter] = useState('All Genres');

  const { user } = useAuth();

  console.log("genreId map:", genreId);


  const fetchWatchlist = async () => {
  if (!user) return;

  try {
    const snapshot = await getDocs(collection(db, "users", user.uid, "watchlist"));
    const movies = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Movie data:", data); // Debug log
      return data;
    });
    setWatchlist(movies);
    setSortedWatchlist(movies);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
  }
};

  const handleRemoveFromWatchlist = async (movie) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "watchlist", movie.id.toString()));
      const updated = watchlist.filter(m => m.id !== movie.id);
      setWatchlist(updated);
      setSortedWatchlist(updated);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const handleAddToWatchlist = async (movie) => {
  if (!user) return;

  try {
    // 👇 Ensure genre_ids exists (fallback to empty array)
    const movieWithGenres = {
      ...movie,
      genre_ids: movie.genre_ids || []  // ✅ Important fix
    };

    await setDoc(doc(db, "users", user.uid, "watchlist", movie.id.toString()), movieWithGenres);

    const updated = [...watchlist, movieWithGenres];
    setWatchlist(updated);
    setSortedWatchlist(updated);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
};


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortInc = () => {
    const sorted = [...sortedWatchlist].sort((a, b) => a.vote_average - b.vote_average);
    setSortedWatchlist(sorted);
    setSortOrder("desc");
  };

  const sortDec = () => {
    const sorted = [...sortedWatchlist].sort((a, b) => b.vote_average - a.vote_average);
    setSortedWatchlist(sorted);
    setSortOrder("asc");
  };

  const sortArrow = () => {
    if (sortOrder === "asc")
      return <i className="fa-solid fa-arrow-down px-1.5 hover:cursor-pointer" onClick={sortInc}></i>;
    else
      return <i className="fa-solid fa-arrow-up px-1.5 hover:cursor-pointer" onClick={sortDec}></i>;
  };

  const handleGenreFilter = (genre) => {
    setGenreFilter(genre);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  useEffect(() => {
  let temp = [];
  watchlist.forEach(movie => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      movie.genre_ids.forEach(id => {
        const name = genreId[id];
        if (name) temp.push(name);
      });
    }
  });
  const uniqueGenres = ["All Genres", ...new Set(temp.sort())];
  setGenreList(uniqueGenres);
}, [watchlist]);

  console.log("Watchlist movies:", watchlist);
  console.log("Genre mapping:", genreId);

  return (
  <>
    {watchlist.length === 0 ? (
      /* Empty State - Responsive */
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="max-w-md">
          <div className="mb-6">
            <i className="fa-solid fa-bookmark text-4xl sm:text-5xl text-gray-600 mb-4"></i>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Nothing to watch yet?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
            Your watchlist is empty. Start exploring and add some amazing movies to get started!
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            <i className="fa-solid fa-film"></i>
            Explore Movies
          </Link>
        </div>
      </div>
    ) : (
      <>
        {/* Genre Filter Section - Responsive */}
        <div className="px-4 sm:px-6 lg:px-8 mt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center sm:text-left">
            Filter by Genre
          </h3>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
            {genreList.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreFilter(genre)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  genre === genreFilter
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Search Section - Responsive */}
        <div className="px-4 sm:px-6 lg:px-8 mt-6 mb-6">
          <div className="max-w-md mx-auto sm:mx-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-gray-400"></i>
              </div>
              <input
                onChange={handleSearch}
                value={searchQuery}
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                placeholder="Search your watchlist..."
              />
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block px-4 sm:px-6 lg:px-8 mb-8">
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <table className="w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      Rating {sortArrow()}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Popularity
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Genres
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(sortedWatchlist || [])
                  .filter((movie) =>
                    genreFilter === 'All Genres'
                      ? true
                      : movie.genre_ids?.some(id => genreId[id] === genreFilter)
                  )
                  .filter((movie) =>
                    movie.title?.toLowerCase().includes(searchQuery.trim().toLowerCase())
                  )
                  .map((movie) => (
                    <tr key={movie.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <img
                            className="h-20 w-14 rounded-lg object-cover shadow-md"
                            src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                            alt={movie.title}
                            onError={(e) => {
                              e.target.src = '/api/placeholder/56/80';
                            }}
                          />
                          <div className="font-medium text-gray-900 dark:text-white">
                            {movie.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <i className="fa-solid fa-star text-yellow-400 text-sm"></i>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {movie.vote_average?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                        {Math.round(movie.popularity) || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 ? 
                            movie.genre_ids.slice(0, 2).map(id => genreId[id] || "Unknown").join(", ") 
                            : "No genres"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleRemoveFromWatchlist(movie)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Remove from watchlist"
                        >
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden px-4 sm:px-6 space-y-4 mb-8">
          {(sortedWatchlist || [])
            .filter((movie) =>
              genreFilter === 'All Genres'
                ? true
                : movie.genre_ids?.some(id => genreId[id] === genreFilter)
            )
            .filter((movie) =>
              movie.title?.toLowerCase().includes(searchQuery.trim().toLowerCase())
            )
            .map((movie) => (
              <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex p-4 space-x-4">
                  <img
                    className="h-24 w-16 sm:h-28 sm:w-20 rounded-lg object-cover shadow-md flex-shrink-0"
                    src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/112';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-2 line-clamp-2">
                      {movie.title}
                    </h3>
                    
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {movie.vote_average?.toFixed(1) || "N/A"}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>Popularity: {Math.round(movie.popularity) || "N/A"}</span>
                      </div>
                      
                      <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Genres: </span>
                        {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 ? 
                          movie.genre_ids.slice(0, 3).map(id => genreId[id] || "Unknown").join(", ") 
                          : "No genres"}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <button
                        onClick={() => handleRemoveFromWatchlist(movie)}
                        className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors text-xs sm:text-sm font-medium"
                      >
                        <i className="fa-solid fa-trash"></i>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    )}
  </>
);
}

export default Watchlist;