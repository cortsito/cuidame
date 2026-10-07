import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../app/router";
import { APP_NAME } from "../config/brand";
import { PassportProvider } from "../state/PassportContext";

function renderShellAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <PassportProvider>
      <RouterProvider router={router} />
    </PassportProvider>,
  );
}

describe("AppShell", () => {
  it("renders the application name from the brand configuration as the main heading", () => {
    renderShellAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(APP_NAME);
  });

  it("exposes header, navigation, main, and footer landmarks", () => {
    renderShellAt("/");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("makes primary navigation reachable by accessible name", () => {
    renderShellAt("/");
    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    expect(within(nav).getByRole("link", { name: "Pasaportes" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Crear pasaporte" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Privacidad" })).toBeInTheDocument();
  });

  it("navigates to a different route when a navigation link is activated", async () => {
    const user = userEvent.setup();
    renderShellAt("/");
    const nav = screen.getByRole("navigation", { name: "Navegación principal" });
    await user.click(within(nav).getByRole("link", { name: "Crear pasaporte" }));
    expect(
      screen.getByRole("heading", { level: 2, name: "Crear un nuevo pasaporte" }),
    ).toBeInTheDocument();
  });
});
