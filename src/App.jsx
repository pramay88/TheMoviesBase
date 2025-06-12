import Watchlist from './components/Watchlist';
import Movies from './components/Movies'
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Banner from './components/Banner';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import { auth } from "./firebaseConfig";
import { AuthProvider } from './context/authContext';


const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {

    let [watchlist, setWatchlist] = useState([])
    const [bannerMovie, setbannerMovie] = useState({});
    
    // Fetching the Trending Movie Banner
    useEffect(() => {
    const fetchBannerMovie = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${TMDB_API_KEY}`);
        setbannerMovie(res.data.results[0]);
      } catch (error) {
        console.error("Error fetching trending movie:", error);
      }
    };

    fetchBannerMovie();
  }, []); // ✅ run once on initial load


    
    let handleAddToWatchlist = (movieObj) => {
      let newWatchlist = [...watchlist, movieObj];
      localStorage.setItem('moviesList', JSON.stringify(newWatchlist))
      setWatchlist(newWatchlist);
      console.log(newWatchlist)
    }
    let handleRemoveFromWatchlist = (movieObj) => {
      let filteredWatchlist = watchlist.filter( (movie) => { return movie.id != movieObj.id})
      setWatchlist(filteredWatchlist)
      localStorage.setItem('moviesList', JSON.stringify(filteredWatchlist))
      console.log(filteredWatchlist)
    }

    useEffect(() => {
      let moviesFromLocalStorage = localStorage.getItem('moviesList');
      if(!moviesFromLocalStorage) return;
      setWatchlist(JSON.parse(moviesFromLocalStorage));
    }, []);

    
  return(
    <>
    <AuthProvider>
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={
        <>
          <Banner bannerMovie={bannerMovie} />
          <Movies 
            watchlist={watchlist} 
            handleAddToWatchlist={handleAddToWatchlist} 
            handleRemoveFromWatchlist={handleRemoveFromWatchlist}
          />
        </>
      } />

      <Route path="/watchlist" element={
        <PrivateRoute>
          <Watchlist 
            watchlist={watchlist} 
            setWatchlist={setWatchlist} 
            handleRemoveFromWatchlist={handleRemoveFromWatchlist}
          />
        </PrivateRoute>
      } />
    </Routes>
  </BrowserRouter>
</AuthProvider>

    </>
  
  );
}

export default App;