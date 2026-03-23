import { describe, it, expect } from "vitest";
import type { AsyncState } from "../../src/types/async-state";
import {
  transition,
  getAvailableEvents,
} from "../../src/machine/transition-table";

describe("transition", () => {
  it("idle + FETCH -> loading", () => {
    const state: AsyncState = { status: "idle" };
    const result = transition(state, { type: "FETCH" });
    expect(result.status).toBe("loading");
  });

  it("loading + RESOLVE -> success with data", () => {
    const state: AsyncState = { status: "loading" };
    const users = [
      { id: "1", name: "Test", email: "t@t.com", department: "Eng" },
    ];
    const result = transition(state, { type: "RESOLVE", data: users });
    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.data).toEqual(users);
      expect(result.fetchedAt).toBeInstanceOf(Date);
    }
  });

  it("loading + REJECT -> error", () => {
    const state: AsyncState = { status: "loading" };
    const error = new Error("fail");
    const result = transition(state, { type: "REJECT", error });
    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.error).toBe(error);
      expect(result.retryCount).toBe(0);
    }
  });

  it("error + RETRY -> loading", () => {
    const state: AsyncState = {
      status: "error",
      error: new Error("fail"),
      retryCount: 0,
    };
    const result = transition(state, { type: "RETRY" });
    expect(result.status).toBe("loading");
  });

  it("success + FETCH -> loading (re-fetch)", () => {
    const state: AsyncState = {
      status: "success",
      data: [],
      fetchedAt: new Date(),
    };
    const result = transition(state, { type: "FETCH" });
    expect(result.status).toBe("loading");
  });

  it("invalid transition: idle + RESOLVE -> stays idle", () => {
    const state: AsyncState = { status: "idle" };
    const users = [
      { id: "1", name: "Test", email: "t@t.com", department: "Eng" },
    ];
    const result = transition(state, { type: "RESOLVE", data: users });
    expect(result).toBe(state); // same reference
  });

  it("invalid transition: idle + RETRY -> stays idle", () => {
    const state: AsyncState = { status: "idle" };
    const result = transition(state, { type: "RETRY" });
    expect(result).toBe(state);
  });

  it("invalid transition: success + REJECT -> stays success", () => {
    const state: AsyncState = {
      status: "success",
      data: [],
      fetchedAt: new Date(),
    };
    const result = transition(state, {
      type: "REJECT",
      error: new Error("x"),
    });
    expect(result).toBe(state);
  });
});

describe("getAvailableEvents", () => {
  it("idle -> [FETCH]", () => {
    expect(getAvailableEvents({ status: "idle" })).toEqual(["FETCH"]);
  });

  it("loading -> [RESOLVE, REJECT]", () => {
    expect(getAvailableEvents({ status: "loading" })).toEqual([
      "RESOLVE",
      "REJECT",
    ]);
  });

  it("success -> [FETCH]", () => {
    const state: AsyncState = {
      status: "success",
      data: [],
      fetchedAt: new Date(),
    };
    expect(getAvailableEvents(state)).toEqual(["FETCH"]);
  });

  it("error -> [RETRY]", () => {
    const state: AsyncState = {
      status: "error",
      error: new Error("x"),
      retryCount: 0,
    };
    expect(getAvailableEvents(state)).toEqual(["RETRY"]);
  });
});
