import type { AsyncState, AsyncEvent } from "../types/async-state";

type StateHandler<S extends AsyncState, E extends AsyncEvent> = (
  state: S,
  event: E,
) => AsyncState | null;

type TransitionTable = {
  [S in AsyncState["status"]]: {
    [E in AsyncEvent["type"]]?: StateHandler<
      Extract<AsyncState, { status: S }>,
      Extract<AsyncEvent, { type: E }>
    >;
  };
};

export const transitionTable: TransitionTable = {
  idle: {
    FETCH: () => ({ status: "loading" }),
  },
  loading: {
    RESOLVE: (_state, event) => ({
      status: "success",
      data: event.data,
      fetchedAt: new Date(),
    }),
    REJECT: (_state, event) => ({
      status: "error",
      error: event.error,
    }),
  },
  success: {
    FETCH: () => ({ status: "loading" }),
  },
  error: {
    RETRY: () => ({
      status: "loading",
    }),
  },
};

// Dispatcher — look up the table and execute the transition
export function transition(state: AsyncState, event: AsyncEvent): AsyncState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (transitionTable[state.status] as any)?.[event.type];
  return handler ? (handler(state, event) ?? state) : state;
}

// Auto-derive available events from the table
export function getAvailableEvents(state: AsyncState): AsyncEvent["type"][] {
  return Object.keys(
    transitionTable[state.status] ?? {},
  ) as AsyncEvent["type"][];
}
