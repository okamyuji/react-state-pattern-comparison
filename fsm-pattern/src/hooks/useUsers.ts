import { useCallback } from "react";
import { useAsyncMachine } from "./useAsyncMachine";

const API_URL = "http://localhost:3001/users";

export function useUsers() {
  const { state, dispatch, availableEvents } = useAsyncMachine();

  const fetchUsers = useCallback(async () => {
    dispatch({ type: "FETCH" });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: "RESOLVE", data });
    } catch (e) {
      dispatch({
        type: "REJECT",
        error: e instanceof Error ? e : new Error(String(e)),
      });
    }
  }, [dispatch]);

  const retry = useCallback(async () => {
    dispatch({ type: "RETRY" });
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      dispatch({ type: "RESOLVE", data });
    } catch (e) {
      dispatch({
        type: "REJECT",
        error: e instanceof Error ? e : new Error(String(e)),
      });
    }
  }, [dispatch]);

  return { state, availableEvents, fetchUsers, retry };
}
