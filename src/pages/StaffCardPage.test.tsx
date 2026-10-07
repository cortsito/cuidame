import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../app/router";
import { PassportProvider } from "../state/PassportContext";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <PassportProvider>
      <RouterProvider router={router} />
    </PassportProvider>,
  );
}

describe("StaffCardPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a not-found state for a missing passport", () => {
    renderAt("/passports/does-not-exist/card");

    expect(
      screen.getByRole("heading", { level: 2, name: "Pasaporte no encontrado" }),
    ).toBeInTheDocument();
  });

  it("shows the staff card content and controls for an existing passport", async () => {
    renderAt("/");
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Ver tarjeta" }));

    expect(await screen.findByRole("heading", { level: 2, name: "Rosa (Doña Rosa)" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Imprimir o guardar como PDF" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a pasaportes" })).toBeInTheDocument();
  });

  it("calls window.print when the print control is activated", async () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    renderAt("/");
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Ver tarjeta" }));

    await user.click(await screen.findByRole("button", { name: "Imprimir o guardar como PDF" }));

    expect(printSpy).toHaveBeenCalledTimes(1);
  });
});
