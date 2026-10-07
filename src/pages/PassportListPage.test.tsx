import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

describe("PassportListPage", () => {
  it("shows the fictional demo passport on a fresh browser state", () => {
    renderAt("/");
    expect(screen.getByText("Rosa (Doña Rosa)")).toBeInTheDocument();
  });

  it("includes the create action and a local-data notice linking to privacy", () => {
    renderAt("/");
    const main = screen.getByRole("main");
    expect(within(main).getByRole("link", { name: "Crear pasaporte" })).toBeInTheDocument();
    expect(within(main).getByRole("link", { name: "Privacidad" })).toBeInTheDocument();
    expect(
      within(main).getByText(/Tus pasaportes se guardan solo en este navegador/),
    ).toBeInTheDocument();
  });

  it("shows the empty state after deleting every passport", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    expect(screen.getByText("Todavía no tienes pasaportes guardados.")).toBeInTheDocument();
  });

  it("duplicates a passport into an independently editable copy", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(screen.getByRole("button", { name: "Duplicar" }));

    expect(screen.getByText("Rosa (Doña Rosa) — copia")).toBeInTheDocument();
  });
});
