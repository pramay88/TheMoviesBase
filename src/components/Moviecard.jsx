function Moviecard({watchlist, movieObj, poster_path, name, handleAddToWatchlist, handleRemoveFromWatchlist}){
    
    function isAdded(movieObj){
        for(let movie of watchlist){
            if(movie.id == movieObj.id) return true;
        }    
        return false;
    }
    
    return (
        <div className="relative h-[50vh] w-[200px] bg-cover bg-center rounded-xl hover:scale-110 duration-300  hover:cursor-pointer flex flex-col justify-between items-end" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original/${poster_path})`}}>
            
            {isAdded(movieObj)?
            <div onClick={() => handleRemoveFromWatchlist(movieObj)} className="m-2.5 absolute right-0 bg-gray-900/60 rounded-xs p-1 text-xl text-white/90"><i className="fa-solid fa-bookmark"></i></div>   
            :<div onClick={() => handleAddToWatchlist(movieObj)} className="m-2.5 absolute right-0 bg-gray-900/60 rounded-xs p-1 text-xl text-white/70"><i className="fa-regular fa-bookmark"></i></div>
            }


            <div className="absolute bottom-0 text-white text-xl w-full p-2 text-center bg-gray-900/60 rounded-b-xl">
                {name}
            </div>
        </div>
    );
}

export default Moviecard;