import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router";
import { PassportProvider } from "../state/PassportContext";

describe("application routes", () => {
  it.each([
    ["/", "Tus pasaportes"],
    ["/passports/new", "Crear un nuevo pasaporte"],
    ["/passports/abc-123/edit", "Pasaporte no encontrado"],
    ["/passports/abc-123/card", "Tarjeta para el personal"],
    ["/privacy", "Privacidad y datos locales"],
  ])("renders a distinct page for %s", (path, headingText) => {
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    render(
      <PassportProvider>
        <RouterProvider router={router} />
      </PassportProvider>,
    );
    expect(screen.getByRole("heading", { level: 2, name: headingText })).toBeInTheDocument();
  });
});
