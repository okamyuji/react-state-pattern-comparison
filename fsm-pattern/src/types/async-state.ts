import type { User } from "./user";

// Discriminated Union — status field is the tag
export type IdleState = { status: "idle" };
export type LoadingState = { status: "loading" };
export type SuccessState = { status: "success"; data: User[]; fetchedAt: Date };
export type ErrorState = {
  status: "error";
  error: Error;
  retryCount: number;
};

export type AsyncState = IdleState | LoadingState | SuccessState | ErrorState;

export type AsyncEvent =
  | { type: "FETCH" }
  | { type: "RESOLVE"; data: User[] }
  | { type: "REJECT"; error: Error }
  | { type: "RETRY" };
