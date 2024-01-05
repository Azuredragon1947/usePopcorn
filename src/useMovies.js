import { useEffect, useState } from "react";
const KEY = "579da41d";
export function useMovies(query, callback) {

      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");
      const [movies, setMovies] = useState([]);
      useEffect(function () {
            callback?.();
            const controller = new AbortController();
            async function getMovies() {
                  try {
                        setIsLoading(true);
                        setError("");

                        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                              { signal: controller.signal }
                        );

                        if (!res.ok) {
                              throw new Error("Something went wrong :(");
                        }

                        const data = await res.json();

                        if (data.Response === 'False') {
                              throw new Error("Movie not Found!");
                        }

                        setMovies(data.Search);
                        setError("");
                  } catch (err) {
                        if (err.name !== "AbortError") {
                              setError(err.message);
                        }
                  } finally {
                        setIsLoading(false);
                  }
            }

            //Cleaning up
            if (!query.length) {
                  setMovies([]);
                  setError("");
                  return;
            }

            getMovies();
            // This will not send a get request after every keystroke, insted will send for the last one only
            //No more race conditions.
            return (function () {
                  controller.abort();
            });
      }, [query]);

      return { movies, isLoading, error };
}