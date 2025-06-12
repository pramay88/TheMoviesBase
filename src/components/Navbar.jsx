import React from "react";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/TheMoviesBase.png";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/authContext";

function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  <>
    <nav className="bg-[#1A1A1A] shadow-md px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          <Link to="/" className="flex-shrink-0">
            <img 
              src={Logo} 
              className="w-[120px] sm:w-[140px] md:w-[150px] h-auto" 
              alt="TheMoviesBase" 
            />
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/watchlist"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-200"
            >
              Watchlist
            </Link>
          </div>
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 bg-[#2C2C2C] px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs lg:text-sm">
                  {getInitials(user.displayName || user.email)}
                </div>
                <span className="text-white text-sm font-medium hidden lg:block max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={logoutHandler}
                className="text-white text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-200 font-medium"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-[#2C2C2C] transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
      <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
        <div className="fixed top-0 right-0 h-full w-64 bg-[#1A1A1A] shadow-xl transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col p-6 space-y-6 mt-16">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200 py-2"
            >
              Home
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200 py-2"
            >
              Watchlist
            </Link>
            
            {/* Mobile User Section */}
            <div className="border-t border-gray-700 pt-6">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-[#2C2C2C] px-4 py-3 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(user.displayName || user.email)}
                    </div>
                    <span className="text-white text-sm font-medium truncate">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logoutHandler();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-white text-sm px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center text-white text-sm px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center text-white text-sm px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-200 font-medium"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

}

export default Navbar;
