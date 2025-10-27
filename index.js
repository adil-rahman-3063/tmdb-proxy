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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
