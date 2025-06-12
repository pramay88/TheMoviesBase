import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

function Moviecard({ movieObj, watchlist, fetchWatchlist }) {
  const { user } = useAuth();
  
  // Initialize with actual watchlist status
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if movie is in watchlist directly from Firestore
  const checkWatchlistStatus = async () => {
    if (!user || !movieObj?.id) return;
    
    try {
      const docRef = doc(db, "users", user.uid, "watchlist", movieObj.id.toString());
      const docSnap = await getDoc(docRef);
      setAdded(docSnap.exists());
    } catch (error) {
      console.error("Error checking watchlist status:", error);
      setAdded(false);
    }
  };

  // Check status when component mounts or user changes
  useEffect(() => {
    checkWatchlistStatus();
  }, [user, movieObj.id]);

  // Also sync with watchlist prop when available (for immediate UI updates)
  useEffect(() => {
    if (watchlist && Array.isArray(watchlist)) {
      const isInWatchlist = watchlist.some((m) => m.id === movieObj.id);
      setAdded(isInWatchlist);
    }
  }, [watchlist, movieObj.id]);

  const handleAddToWatchlist = async (movie) => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      const genreIds =
        movie.genre_ids && Array.isArray(movie.genre_ids)
          ? movie.genre_ids
          : movie.genres?.map((g) => g.id) || [];

      const cleanedMovie = {
        id: movie.id,
        title: movie.title || movie.name || "",
        vote_average: movie.vote_average || 0,
        popularity: movie.popularity || 0,
        poster_path: movie.poster_path || "",
        genre_ids: genreIds,
        dateAdded: new Date().toISOString(), // Add timestamp
      };

      await setDoc(
        doc(db, "users", user.uid, "watchlist", movie.id.toString()),
        cleanedMovie
      );
      
      // Optimistic update
      setAdded(true);
      
      // Refresh watchlist data
      if (fetchWatchlist) {
        await fetchWatchlist();
      }
    } catch (error) {
      console.error("Error adding movie:", error.message);
      // Revert optimistic update on error
      setAdded(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movie) => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      await deleteDoc(
        doc(db, "users", user.uid, "watchlist", movie.id.toString())
      );
      
      // Optimistic update
      setAdded(false);
      
      // Refresh watchlist data
      if (fetchWatchlist) {
        await fetchWatchlist();
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      // Revert optimistic update on error
      setAdded(true);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is not authenticated
  if (!user) {
    return (
      <div
        className="relative h-[50vh] w-[200px] bg-cover bg-center rounded-xl hover:scale-110 duration-300 hover:cursor-pointer flex flex-col justify-between items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieObj.poster_path})`,
        }}
      >
        <div className="absolute bottom-0 text-white text-xl w-full p-2 text-center bg-gray-900/60 rounded-b-xl">
          {movieObj.title || movieObj.name}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[50vh] w-[200px] bg-cover bg-center rounded-xl hover:scale-110 duration-300 hover:cursor-pointer flex flex-col justify-between items-end"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieObj.poster_path})`,
      }}
    >
      <div
        onClick={() => 
          added 
            ? handleRemoveFromWatchlist(movieObj) 
            : handleAddToWatchlist(movieObj)
        }
        className={`m-2.5 absolute right-0 bg-gray-900/60 rounded-xs p-1 text-xl transition-all duration-200 ${
          loading 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer hover:bg-gray-900/80'
        } ${
          added 
            ? 'text-yellow-400' 
            : 'text-white/70 hover:text-white/90'
        }`}
      >
        {loading ? (
          <i className="fa-solid fa-spinner fa-spin"></i>
        ) : added ? (
          <i className="fa-solid fa-bookmark"></i>
        ) : (
          <i className="fa-regular fa-bookmark"></i>
        )}
      </div>

      <div className="absolute bottom-0 text-white text-xl w-full p-2 text-center bg-gray-900/60 rounded-b-xl">
        {movieObj.title || movieObj.name}
      </div>
    </div>
  );
}

export default Moviecard;