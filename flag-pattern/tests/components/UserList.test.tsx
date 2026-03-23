import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserList } from "../../src/components/UserList";

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

describe("UserList", () => {
  it("shows fetch button in idle state", () => {
    render(<UserList />);
    expect(screen.getByText("Fetch Users")).toBeInTheDocument();
    expect(screen.getByText(/Click the button/)).toBeInTheDocument();
  });

  it("shows user data on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      }),
    );
    const user = userEvent.setup();

    render(<UserList />);
    await user.click(screen.getByText("Fetch Users"));

    expect(await screen.findByText(/田中太郎/)).toBeInTheDocument();
    expect(screen.getByText(/佐藤花子/)).toBeInTheDocument();
  });

  it("shows error with retry button on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );
    const user = userEvent.setup();

    render(<UserList />);
    await user.click(screen.getByText("Fetch Users"));

    expect(await screen.findByText(/Network error/)).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });
});
