import { useState, useEffect, SetStateAction, Dispatch } from "react";

const PREFIX = "fanfic2book-";
const useLocalStorage = (
  key: string,
  initialValue: any
): [string, Dispatch<SetStateAction<any>>] => {
  const prefixedKey = PREFIX + key;
  const [value, setValue]: [string, Dispatch<SetStateAction<any>>] = useState(
    () => {
      const jsonValue = localStorage.getItem(prefixedKey);
      if (jsonValue !== null) return JSON.parse(jsonValue);
      return initialValue;
    }
  );
  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [value, prefixedKey]);
  return [value, setValue];
};

export default useLocalStorage;