import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../app/router";
import { PassportProvider } from "../state/PassportContext";
import { loadStore } from "../state/passportRepository";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <PassportProvider>
      <RouterProvider router={router} />
    </PassportProvider>,
  );
}

describe("PrivacyPage", () => {
  it("explains local-only storage, deletion, and the non-clinical boundary", () => {
    renderAt("/privacy");

    expect(screen.getByText(/se guardan solo en este navegador/)).toBeInTheDocument();
    expect(screen.getByText(/Borrar todos los pasaportes»/)).toBeInTheDocument();
    expect(screen.getByText(/no es un expediente médico/)).toBeInTheDocument();
  });

  it("cancelling clear-all changes nothing", async () => {
    const user = userEvent.setup();
    renderAt("/privacy");

    await user.click(screen.getByRole("button", { name: "Borrar todos los pasaportes" }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(loadStore().passports.length).toBeGreaterThan(0);
  });

  it("confirming clear-all removes every passport and returns to the empty list", async () => {
    const user = userEvent.setup();
    renderAt("/privacy");

    await user.click(screen.getByRole("button", { name: "Borrar todos los pasaportes" }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Borrar todos los pasaportes" }));

    expect(
      await screen.findByRole("heading", { level: 2, name: "Tus pasaportes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Todavía no tienes pasaportes guardados.")).toBeInTheDocument();
    expect(loadStore().passports).toHaveLength(0);
  });

  it("does not reseed the demo passport after clear-all and reload", async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt("/privacy");

    await user.click(screen.getByRole("button", { name: "Borrar todos los pasaportes" }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Borrar todos los pasaportes" }));
    await screen.findByText("Todavía no tienes pasaportes guardados.");
    unmount();

    renderAt("/");
    expect(screen.getByText("Todavía no tienes pasaportes guardados.")).toBeInTheDocument();
  });
});
