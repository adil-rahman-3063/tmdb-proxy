import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ message: "TMDB Proxy is running!" });
});

// ✅ Popular movies - Flutter app uses /movie/popular
app.get("/movie/popular", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular movies", details: err.message });
  }
});

// ✅ Keep /movies/popular for backward compatibility
app.get("/movies/popular", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular movies", details: err.message });
  }
});

// ✅ Discover movies by genre - NEW for Flutter app
app.get("/discover/movie", async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query).toString();
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&${queryParams}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to discover movies", details: err.message });
  }
});

// ✅ Get movie genres list - NEW for Flutter app
app.get("/genre/movie/list", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch genres", details: err.message });
  }
});

// ✅ Popular TV series
app.get("/tv/popular", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular TV series", details: err.message });
  }
});

// ✅ Discover TV series by genre
app.get("/discover/tv", async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query).toString();
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&${queryParams}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to discover TV series", details: err.message });
  }
});

// ✅ Get TV genres list
app.get("/genre/tv/list", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TV genres", details: err.message });
  }
});

// ✅ Trending movies this week
app.get("/trending/movie", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending movies", details: err.message });
  }
});

// ✅ Trending TV series this week
app.get("/trending/tv", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending TV series", details: err.message });
  }
});

// ✅ Newly released movies
app.get("/movie/now-playing", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch now playing movies", details: err.message });
  }
});

// ✅ Newly released TV series (on the air)
app.get("/tv/on-the-air", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch on-air TV series", details: err.message });
  }
});

// ✅ Search movies
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query parameter ?q=" });

  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

// ✅ Get movie details
app.get("/movie/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie details", details: err.message });
  }
});

// ✅ Get TV show details
app.get("/tv/:id", async (req, res) => {
  const { id } = req.params;
  // Check if id is numeric to avoid conflict with other routes if any (though express handles specific routes first usually)
  // But strictly, /tv/popular is handled above, so /tv/:id will catch everything else.
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TV details", details: err.message });
  }
});

// ✅ Get TV season details
app.get("/tv/:id/season/:season_number", async (req, res) => {
  const { id, season_number } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/season/${season_number}?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch season details", details: err.message });
  }
});

// ✅ Get movie videos
app.get("/movie/:id/videos", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie videos", details: err.message });
  }
});

// ✅ Get TV videos
app.get("/tv/:id/videos", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TV videos", details: err.message });
  }
});

// ✅ Get movie watch providers
app.get("/movie/:id/watch/providers", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie providers", details: err.message });
  }
});

// ✅ Get TV watch providers
app.get("/tv/:id/watch/providers", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/watch/providers?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TV providers", details: err.message });
  }
});

// ✅ Get movie credits (cast)
app.get("/movie/:id/credits", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie credits", details: err.message });
  }
});

// ✅ Get TV credits (cast)
app.get("/tv/:id/credits", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TV credits", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
