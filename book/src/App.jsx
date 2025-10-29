import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatically detect if input is title, author, or subject
  const detectType = (input) => {
    if (!input) return "title";
    const lower = input.toLowerCase();

    const genres = ["mystery", "romance", "horror", "thriller", "fantasy", "science", "fiction"];
    if (genres.some((g) => lower.includes(g))) return "subject";
    if (input.split(" ").length >= 2) return "author";
    return "title";
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const type = detectType(query);
      const url = `https://openlibrary.org/search.json?${type}=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs.slice(0, 20));
      } else {
        setError("No results found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📚 Open Library Book Finder</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter book title, author, or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchBooks} disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {books.map((book, i) => (
          <div key={i} className="card">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
            />
            <h2>{book.title}</h2>
            <p>
              👤 {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p>🗓 {book.first_publish_year ? book.first_publish_year : "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
