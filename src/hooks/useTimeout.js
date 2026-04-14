import { useEffect } from "react";

export function useTimeout(callback, delay, deps = []) {
  useEffect(() => {
    if (delay === null) return;
    const t = setTimeout(callback, delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);
}
