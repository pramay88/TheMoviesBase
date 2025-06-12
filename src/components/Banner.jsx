function Banner({ bannerMovie }) {
    return (
        <div 
            className="relative w-full h-[30vh] sm:h-[40vh] md:h-[60vh] lg:h-[75vh] xl:h-[85vh] bg-cover bg-no-repeat bg-center overflow-hidden"
            style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path})`,
            }}
        >
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end">
                {/* Title Section */}
                <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 pb-4 sm:pb-6 md:pb-8">
                    <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center sm:text-left leading-tight drop-shadow-lg">
                        {bannerMovie.title || bannerMovie.name}
                    </h1>
                    
                    {/* Optional: Movie details for larger screens */}
                    {bannerMovie.overview && (
                        <div className="hidden sm:block mt-2 md:mt-4">
                            <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-md">
                                {bannerMovie.overview}
                            </p>
                        </div>
                    )}
                    
                    {/* Optional: Rating and year */}
                    <div className="hidden md:flex items-center mt-3 lg:mt-4 space-x-4 text-white/80">
                        {bannerMovie.vote_average && (
                            <div className="flex items-center space-x-1">
                                <i className="fa-solid fa-star text-yellow-400"></i>
                                <span className="text-sm lg:text-base font-medium">
                                    {bannerMovie.vote_average.toFixed(1)}
                                </span>
                            </div>
                        )}
                        {bannerMovie.release_date && (
                            <div className="text-sm lg:text-base">
                                {new Date(bannerMovie.release_date).getFullYear()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Fallback for missing backdrop */}
            {!bannerMovie.backdrop_path && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-white text-center">
                        <i className="fa-solid fa-film text-4xl sm:text-5xl md:text-6xl opacity-50 mb-4"></i>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                            {bannerMovie.title || bannerMovie.name}
                        </h1>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Banner;