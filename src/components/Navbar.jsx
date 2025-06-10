import React from "react";
import { Link } from "react-router-dom";
function Navbar(){
    const imgSrc = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/575px-IMDB_Logo_2016.svg.png?20200406194337";
    return(
        <div className="flex border space-x-8 items-center pl-3 py-4">
            <img src={imgSrc} className="w-[80px]"></img>   
            <Link to="/" className="text-blue-400 text-3xl font-bold">Home</Link>
            <Link to="/watchlist" className="text-blue-400 text-3xl font-bold">Watchlist</Link>
        </div>
    );
}

export default Navbar;