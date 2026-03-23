import { useState, useCallback } from "react";
import type { User } from "../types/user";

const API_URL = "http://localhost:3001/users";

// BAD: Multiple independent boolean flags create 2^n possible combinations
export function useUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    // BUG-PRONE: hasData is NOT reset — stale data remains visible during reload
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const users: User[] = await res.json();
      setData(users);
      setHasData(true);
      setIsError(false);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      setIsError(true);
      // BUG-PRONE: hasData might still be true from previous fetch
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { isLoading, isError, hasData, data, error, fetchUsers, retry };
}
