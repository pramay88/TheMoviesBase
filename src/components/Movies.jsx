import { useEffect, useState } from 'react';
import Moviecard from './Moviecard'

import axios from 'axios'
import Pagination from './Pagination';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
function Movies({handleAddToWatchlist, handleRemoveFromWatchlist, watchlist}){

    const isLocal = import.meta.env.DEV;

    const [movies, setMovies] = useState([]);
    const [pageNo, setPageNo] = useState(1);

    const handlePrev = () => {
        if(pageNo == 1) setPageNo(1);
        else setPageNo(pageNo-1)
    }
    const handleNext = () => {
        setPageNo(pageNo+1)
    }

    useEffect(() => {
    const fetchUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNo}`;


    axios.get(fetchUrl)
      .then((res) => {
        setMovies(res.data.results);
      })
      .catch((err) => {
        console.error('Error fetching movies:', err);
      });
}, [pageNo]);


    

    return (
    <div className='px-3 py-5 sm:px-5'>
        {/* Title Section - Responsive typography */}
        <div className="text-xl sm:text-2xl lg:text-3xl mx-2 sm:mx-5 mb-6 sm:mb-8 text-center font-bold">
            Trending Movies
        </div>
        
        {/* Movies Grid - Responsive layout */}
        <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mx-2 sm:mx-4 md:mx-6 lg:mx-10 mb-8 sm:mb-10'>
            {Array.isArray(movies) && movies.map((movieObj) => (
                <div key={movieObj.id} className="w-full">
                    <Moviecard movieObj={movieObj} />
                </div>
            ))}
        </div>
        
        {/* Pagination - Responsive positioning */}
        <div className="px-2 sm:px-0">
            <Pagination 
                handlePrev={handlePrev} 
                handleNext={handleNext} 
                pageNo={pageNo}
            />
        </div>
    </div>
);
}
export default Movies;