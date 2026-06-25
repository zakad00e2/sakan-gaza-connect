import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./Header";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { id: "authenticated-user" },
    loading: false,
    signOut: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-is-admin", () => ({
  useIsAdmin: () => ({ isAdmin: false }),
}));

describe("Header authenticated navigation", () => {
  it("keeps the desktop safety link visible after login", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const desktopNavigation = screen
      .getAllByRole("navigation")
      .find((navigation) => navigation.classList.contains("sm:flex"));

    expect(desktopNavigation).toBeDefined();
    expect(
      desktopNavigation?.querySelector('a[href="/safety"]'),
    ).toBeInTheDocument();
  });
});
