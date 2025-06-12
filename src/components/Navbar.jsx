import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/TheMoviesBase.png";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/authContext";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "U";
    const name = nameOrEmail.split(" ")[0]; // First name or email
    return name[0].toUpperCase();
  };

  return (
    <nav className="bg-[#1A1A1A] shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/">
          <img src={Logo} className="w-[150px]" alt="TheMoviesBase" />
        </Link>
        <Link
          to="/"
          className="text-white text-lg font-semibold hover:text-gray-300 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/watchlist"
          className="text-white text-lg font-semibold hover:text-gray-300 transition-colors"
        >
          Watchlist
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="flex items-center space-x-2 bg-[#2C2C2C] px-3 py-1 rounded-full">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                {getInitials(user.displayName || user.email)}
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {user.displayName || user.email}
              </span>
            </div>
            <button
              onClick={logoutHandler}
              className="text-white text-sm px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white text-sm px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white text-sm px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-200"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
