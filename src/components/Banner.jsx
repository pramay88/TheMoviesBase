
function Banner({bannerMovie}){
    return (
        <div className="relative h-[20vh] md:h-[85vh] bg-cover bg-no-repeat bg-center" style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path})`}}>
            <div className="absolute bottom-0 text-white text-2xl text-center w-full bg-gray-900/70 p-4">{bannerMovie.title}</div>
            {console.log(bannerMovie)}
        </div>
    );
}
export default Banner;