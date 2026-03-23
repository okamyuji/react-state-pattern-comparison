import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUsers } from "../../src/hooks/useUsers";

const mockUsers = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    department: "Engineering",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    department: "Design",
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useUsers", () => {
  it("initial state is idle", () => {
    const { result } = renderHook(() => useUsers());
    expect(result.current.state.status).toBe("idle");
    expect(result.current.availableEvents).toEqual(["FETCH"]);
  });

  it("fetchUsers transitions to success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      }),
    );

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.state.status).toBe("success");
    if (result.current.state.status === "success") {
      expect(result.current.state.data).toEqual(mockUsers);
    }
    expect(result.current.availableEvents).toEqual(["FETCH"]);
  });

  it("fetchUsers transitions to error on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.state.status).toBe("error");
    if (result.current.state.status === "error") {
      expect(result.current.state.error.message).toBe("Network error");
    }
    expect(result.current.availableEvents).toEqual(["RETRY"]);
  });

  it("retry after error transitions back to success", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.fetchUsers();
    });
    expect(result.current.state.status).toBe("error");

    await act(async () => {
      await result.current.retry();
    });
    expect(result.current.state.status).toBe("success");
  });
});
