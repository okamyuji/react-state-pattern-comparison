import { renderHook, act, waitFor } from "@testing-library/react";
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
  it("initial state: all flags are false", () => {
    const { result } = renderHook(() => useUsers());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.hasData).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetchUsers: sets isLoading then transitions to hasData on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      }),
    );

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      result.current.fetchUsers();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.hasData).toBe(true);
    expect(result.current.data).toEqual(mockUsers);
    expect(result.current.isError).toBe(false);
  });

  it("fetchUsers: sets isError on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      result.current.fetchUsers();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe("Network error");
  });

  it("retry: re-fetches after error", async () => {
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
      result.current.fetchUsers();
    });
    await waitFor(() => expect(result.current.isError).toBe(true));

    await act(async () => {
      result.current.retry();
    });
    await waitFor(() => expect(result.current.hasData).toBe(true));

    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockUsers);
  });
});
