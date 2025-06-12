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
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Nothing to watch yet?</h2>
          <p className="text-gray-500 mt-2">Add some movies to get started!</p>
          <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Explore Movies
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-center flex-wrap m-4">
            {genreList.map((genre) => (
              <div
                key={genre}
                onClick={() => handleGenreFilter(genre)}
                className={
                  genre === genreFilter
                    ? "bg-blue-400 h-[3rem] w-[9rem] flex justify-center items-center text-white font-bold rounded-xl m-3 hover:cursor-pointer"
                    : "bg-gray-400/50 h-[3rem] w-[9rem] flex justify-center items-center text-white font-bold rounded-xl m-3 hover:cursor-pointer"
                }
              >
                {genre}
              </div>
            ))}
          </div>

          <div className="flex justify-center my-4">
            <input
              onChange={handleSearch}
              value={searchQuery}
              type="text"
              className="h-[3rem] w-[18rem] bg-gray-200 outline-none px-4"
              placeholder="Search Movies"
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 m-8">
            <table className="w-full text-gray-500 text-center">
              <thead className="border-b-2">
                <tr>
                  <th>Name</th>
                  <th className="flex justify-center">
                    <div className="px-1.5">Rating</div>
                    <div>{sortArrow()}</div>
                  </th>
                  <th>Popularity</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
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
      <tr className="border-b-2" key={movie.id}>
        <td className="flex items-center px-6 py-4">
          <img
            className="h-[8rem]"
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            alt={movie.title}
          />
          <div className="mx-4">{movie.title}</div>
        </td>
        <td>{movie.vote_average?.toFixed(1) || "N/A"}</td>
        <td>{movie.popularity || "N/A"}</td>
        <td className="py-3 px-4">
  {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0 ? 
    movie.genre_ids.map(id => genreId[id] || "Unknown").join(" | ") 
    : "No genres available"}
</td>
        <td
          className="text-red-500 hover:cursor-pointer"
          onClick={() => handleRemoveFromWatchlist(movie)}
        >
          Delete
        </td>
      </tr>
    ))}
</tbody>

            </table>
          </div>
        </>
      )}
    </>
  );
}

export default Watchlist;