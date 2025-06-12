export async function handler(event) {
  const { page = 1 } = event.queryStringParameters;
  const apiKey = process.env.VITE_TMDB_API_KEY;

  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch movies', error }),
    };
  }
}
