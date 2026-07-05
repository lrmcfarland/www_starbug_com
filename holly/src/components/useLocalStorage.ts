import { useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(
        `Error reading localStorage key "${key}":`,
        error
      );
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          key,
          JSON.stringify(storedValue)
        );
      }
    } catch (error) {
      console.warn(
        `Error setting localStorage key "${key}":`,
        error
      );
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
