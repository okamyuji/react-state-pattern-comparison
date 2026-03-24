import { useCallback } from "react";
import { useAsyncMachine } from "./useAsyncMachine";

const API_URL = "http://localhost:3001/users";

export function useUsers() {
  const { state, dispatch, availableEvents } = useAsyncMachine();

  const execute = useCallback(
    async (trigger: "FETCH" | "RETRY") => {
      dispatch({ type: trigger });
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
    },
    [dispatch],
  );

  const fetchUsers = useCallback(() => execute("FETCH"), [execute]);
  const retry = useCallback(() => execute("RETRY"), [execute]);

  return { state, availableEvents, fetchUsers, retry };
}
