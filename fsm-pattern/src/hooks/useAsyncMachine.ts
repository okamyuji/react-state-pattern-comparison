import { useReducer, useMemo } from "react";
import type { AsyncState } from "../types/async-state";
import { transition, getAvailableEvents } from "../machine/transition-table";

const initialState: AsyncState = { status: "idle" };

export function useAsyncMachine() {
  const [state, dispatch] = useReducer(transition, initialState);

  const availableEvents = useMemo(() => getAvailableEvents(state), [state]);

  return { state, dispatch, availableEvents };
}
