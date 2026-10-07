import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router";

describe("application routes", () => {
  it.each([
    ["/", "Tus pasaportes"],
    ["/passports/new", "Crear un nuevo pasaporte"],
    ["/passports/abc-123/edit", "Editar pasaporte"],
    ["/passports/abc-123/card", "Tarjeta para el personal"],
    ["/privacy", "Privacidad y datos locales"],
  ])("renders a distinct page for %s", (path, headingText) => {
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("heading", { level: 2, name: headingText })).toBeInTheDocument();
  });
});
