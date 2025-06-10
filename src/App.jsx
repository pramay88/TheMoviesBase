import Watchlist from './components/Watchlist';
import Movies from './components/Movies'
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Banner from './components/Banner';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

    let [watchlist, setWatchlist] = useState([])
    const [bannerMovie, setbannerMovie] = useState({});
    
    // Fetching the Trending Movie Banner
    useEffect(() => {
    const fetchBannerMovie = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=81259944aa7da245930b453f452d7bdf`);
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
    <BrowserRouter>
      <Navbar/>
      <Routes>
          <Route path="/" element={
            <>
              <Banner bannerMovie={bannerMovie}/>
              <Movies watchlist={watchlist} handleAddToWatchlist={handleAddToWatchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist}/>
            </>
          }
          />
        <Route path="/watchlist" element={
          <Watchlist watchlist={watchlist} setWatchlist={setWatchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist}/>
        }
        />
      </Routes>
      
    </BrowserRouter>
    </>
  
  );
}

export default App;