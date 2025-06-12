import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { genreId } from "../utility/genre";

function Watchlist({watchlist, handleRemoveFromWatchlist}){

    const [searchQuery, setsearchQuery] = useState('');
    const [sortedWatchlist, setSortedWatchlist] = useState(watchlist);
    const [sortOrder, setSortOrder] = useState('asc');
    const [genreList, setGenreList] = useState([]);
    const [genreFilter, setGenreFilter] = useState('All Genres')

    const handleSearch = (e) => {
        setsearchQuery(e.target.value)
    }

    let sortInc = () => {
        const sorted = watchlist.sort((a, b) => {
            return a.vote_average - b.vote_average;
        });
        setSortedWatchlist([...sorted]);
        setSortOrder("desc")
    }
    let sortDec = () => {
        const sorted = watchlist.sort((a, b) => {
            return b.vote_average - a.vote_average;
        });
        setSortedWatchlist([...sorted]);
        setSortOrder('asc')
    }

    const sortArrow = () => {
        if (sortOrder === "asc")
            return <i className="fa-solid fa-arrow-down px-1.5 hover:cursor-pointer" onClick={() => sortInc()}></i>
        
        else if (sortOrder === "desc")
            return <i className="fa-solid fa-arrow-up px-1.5 hover:cursor-pointer" onClick={() => sortDec()}></i>
         
    };

    const handleGenreFilter = (genre) => {
        setGenreFilter(genre);
    }

    useEffect(() => {
        let temp = [];

        watchlist.map(movie => {
            movie.genre_ids.map(id => {
                const name = genreId[id];
                if (name) temp.push(name);
            });
        });

        const uniqueGenres = ["All Genres", ...new Set(temp.sort())];
        setGenreList(uniqueGenres);
    }, [watchlist]);

        
    return(
        <>
        {
        watchlist.length === 0?
            <div className="flex flex-col items-center justify-center mt-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Nothing to watch yet?</h2>
            <p className="text-gray-500 mt-2">Add some movies to get started!</p>
            <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Explore Movies
            </Link>
            </div>
        :(
            <>
             <div className="flex justify-center flex-wrap m-4">
                {genreList.map((genre) => {
                    return <div key={genre} onClick={() => handleGenreFilter(genre)} className={ genre===genreFilter?"bg-blue-400 h-[3rem] w-[9rem] flex justify-center items-center text-white font-bold rounded-xl m-3 hover:cursor-pointer": "bg-gray-400/50 h-[3rem] w-[9rem] flex justify-center items-center text-white font-bold rounded-xl m-3 hover:cursor-pointer"}>{genre}</div>
                })}
                
                {/* <div className="bg-blue-400 h-[3rem] w-[9rem] flex justify-center items-center text-white font-bold rounded-xl mx-4">All Genre</div> */}
                

            </div>

            <div className="flex justify-center my-4">
                <input onChange={handleSearch} value={searchQuery} type="text" className="h-[3rem] w-[18rem] bg-gray-200 outline-none px-4" placeholder="Search Movies"></input>
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
                        
                        {watchlist.filter((movie) => {
                            if( genreFilter == 'All Genres') return true;
                            else {
                                return movie.genre_ids.some(id => genreId[id] === genreFilter);
                            }
                        }).filter((movie) => {return movie.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
                        }).map((movie) => {
                            return <tr className="border-b-2" key={movie.id}>
                                <td className="flex items-center px-6 py-4">
                                    <img className="h-[8rem]" src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}></img>
                                    <div className="mx-4">{movie.title}</div>
                                </td>
                                <td>{movie.vote_average.toFixed(1)}</td>
                                <td>{movie.popularity}</td>
                                <td>{movie.genre_ids.map(id => genreId[id]).join(" | ")}</td>
                                <td className="text-red-500 hover:cursor-pointer" onClick={() =>handleRemoveFromWatchlist(movie)}>Delete</td>
                            </tr>    
                        })}
                    </tbody>

                </table>
            </div>
            </>
        )}
    
        </>
    );
}
export default Watchlist;