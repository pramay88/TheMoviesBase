import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/TheMoviesBase.png"

function Navbar(){
    
    return(
        <div className="flex bg-[#1A1A1A] border space-x-8 items-center pl-3 py-4">
            <Link to="/" className="text-white text-3xl font-bold"> <img src={Logo} className="w-[150px]" alt="TheMoviesBase"></img> </Link>
            <Link to="/" className="text-white text-3xl font-bold">Home</Link>
            <Link to="/watchlist" className="text-white text-3xl font-bold">Watchlist</Link>
        </div>
    );
}

export default Navbar;