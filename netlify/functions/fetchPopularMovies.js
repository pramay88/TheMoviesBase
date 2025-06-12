// netlify/functions/fetchMovies.js
import axios from "axios";

export default async (req, res) => {
  const API_KEY = process.env.VITE_TMDB_API_KEY;
  const { page } = req.query;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
          page: page || 1,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};
