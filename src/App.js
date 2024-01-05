import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "579da41d";

export default function App() {
  // const [watched, setWatched] = useState(function () {
  //   if (localStorage.getItem("movies") === null) {
  //     return [];
  //   }
  //   const val = localStorage.getItem("movies");
  //   return JSON.parse(val);
  // });
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  function handleSelectMovie(id) {
    setSelectedId(setSelectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }


  return (
    <>
      <Navbar query={query} setQuery={setQuery}>
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId
            ? <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched} />
            :
            (<>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} /></>
            )}
        </Box>
      </Main >
    </>
  );
}

function Loader() {
  return (
    <p className="loader">Loading...</p>
  )
}

function ErrorMessage({ message }) {
  return (
    <p className="error">🚫{message}</p>
  )
}

function Navbar({ children, query, setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      {/* {movies.length} */}
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Search({ query, setQuery }) {
  const inputMov = useRef(null);

  useEffect(function () {
    function callback(e) {
      if (e.code === 'Enter') {
        inputMov.current.focus();
      }
    }
    document.addEventListener("keydown", callback);
    return () => document.addEventListener("keydown", callback);
  }, [])

  // useEffect(function () {
  //   const x = document.querySelector('.search');
  //   x.focus();
  // }, [])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputMov}
    />
  )
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  )

}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, onSelectMovie }) {

  return (
    <ul className="list">
      {movies?.map((movie) => <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />)}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState([]);
  const [userRating, setUserRating] = useState('');
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Released: released,
    imdbRating,
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot } = movie;

  const isWatched = watched.map((mov) => mov.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;
  function handleAdd() {
    const newWatchedMoive = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating
    };

    onAddWatched(newWatchedMoive);
    onCloseMovie();
  }
  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(
    function () {
      if (!title) return;
      document.title = title;

      //Clean up effect
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  //Handling key press events
  useEffect(function () {
    function callback(e) {
      if (e.code === 'Escape') {
        onCloseMovie();
      }
    }

    document.addEventListener('keydown', callback);

    return (
      function () {
        document.removeEventListener('keydown', callback);
      }
    )
  },
    [onCloseMovie]);


  return (
    <div className="details">
      {isLoading
        ? <Loader />
        : (<>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              👈
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>⭐</span>{imdbRating} IMDB Rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched === false
                ? <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRating={setUserRating} />
                  {userRating > 0 && <button className="btn-add" onClick={handleAdd}>Add to List</button>}
                </>
                : <p className="rating">You already rated it with {watchedUserRating}⭐</p>}
            </div>
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>)}
    </div>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {
        watched?.map((movie) => <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched} />)
      }
    </ul>
  )
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>x</button>
      </div>
    </li>
  )
}


