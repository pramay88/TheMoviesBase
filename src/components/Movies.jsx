import { useEffect, useState } from 'react';
import Moviecard from './Moviecard'

import axios from 'axios'
import Pagination from './Pagination';

function Movies({handleAddToWatchlist, handleRemoveFromWatchlist, watchlist}){

    const [movies, setMovies] = useState([]);
    const [pageNo, setPageNo] = useState(1);

    const handlePrev = () => {
        if(pageNo == 1) setPageNo(1);
        else setPageNo(pageNo-1)
    }
    const handleNext = () => {
        setPageNo(pageNo+1)
    }

    useEffect(()=>{
        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNo}`).then((res) =>{
            setMovies(res.data.results);
        })
    }, [pageNo])
    

    return(
        <div className='p-5'>
            <div className="text-2xl m-5 text-center font-bold">
                Trending Movies
            </div>
            <div className='flex flex-row flex-wrap justify-around m-10 gap-8'>

                {movies.map((movieObj)=>{
                    return <Moviecard key={movieObj.id} watchlist={watchlist} movieObj={movieObj} poster_path={movieObj.poster_path} name={movieObj.original_title} handleAddToWatchlist={handleAddToWatchlist} handleRemoveFromWatchlist={handleRemoveFromWatchlist }/>
                })}

            </div>
            
            <Pagination handlePrev={handlePrev} handleNext={handleNext} pageNo={pageNo}/>
        </div>
    );
}
export default Movies;

// https://api.themoviedb.org/3/movie/popular?api_key=81259944aa7da245930b453f452d7bdf&language=en
