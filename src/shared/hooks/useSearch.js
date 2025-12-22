import { useState, useMemo } from "react";

export function useSearch(data, matcher) {
  const [term, setTerm] = useState("");

  const filtered = useMemo(
    () => data.filter(item => matcher(item, term)).reverse(),
    [data, term, matcher]
  );

  return { term, setTerm, filtered };
}
