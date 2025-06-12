function Pagination({ handlePrev, handleNext, pageNo }) {
    return (
        <div className="flex justify-center items-center mt-6 sm:mt-8">
            <div className="flex items-center bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-700">
                {/* Previous Button */}
                <button
                    onClick={handlePrev}
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-l-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pageNo <= 1}
                    aria-label="Previous page"
                >
                    <i className="fa-solid fa-chevron-left text-sm sm:text-base"></i>
                </button>

                {/* Page Number Display */}
                <div className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-gray-700/50 border-x border-gray-600">
                    <span className="text-white font-semibold text-sm sm:text-base lg:text-lg min-w-[3ch] text-center">
                        {pageNo}
                    </span>
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-r-full transition-all duration-200 active:scale-95"
                    aria-label="Next page"
                >
                    <i className="fa-solid fa-chevron-right text-sm sm:text-base"></i>
                </button>
            </div>
        </div>
    );
}

export default Pagination;