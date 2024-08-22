import { useState, useEffect } from "react";

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("error in custom hook sessionStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("error in custom hook sessionStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
