import { useState, useEffect } from "react";
export function useLocalStorage(initialState, key) {
      const [value, setValue] = useState(function () {
            const val = localStorage.getItem(key);
            if (val === null) {
                  return initialState;
            }
            return JSON.parse(val);
      });

      useEffect(function () {
            localStorage.setItem(key, JSON.stringify(value));
      }, [value, key]);

      return [value, setValue];
}
