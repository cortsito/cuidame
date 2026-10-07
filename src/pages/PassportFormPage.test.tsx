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

describe("PassportFormPage", () => {
  it("states that the form is not a medical record", () => {
    renderAt("/passports/new");
    expect(
      within(screen.getByRole("main")).getByText(/Este formulario no es un expediente médico/),
    ).toBeInTheDocument();
  });

  it("creates a passport with only the required fields and returns to the list", async () => {
    const user = userEvent.setup();
    renderAt("/passports/new");

    await user.type(screen.getByLabelText("Nombre preferido"), "Juan");
    await user.click(
      screen.getByLabelText("Confirmo que tengo autorización para registrar esta información."),
    );
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(
      await screen.findByRole("heading", { level: 2, name: "Tus pasaportes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Juan")).toBeInTheDocument();
  });

  it("blocks save and shows errors when the preferred name is missing", async () => {
    const user = userEvent.setup();
    renderAt("/passports/new");

    await user.click(
      screen.getByLabelText("Confirmo que tengo autorización para registrar esta información."),
    );
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Crear un nuevo pasaporte" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Revisa los siguientes campos")).toBeInTheDocument();
  });

  it("blocks save and shows errors when authorization is missing", async () => {
    const user = userEvent.setup();
    renderAt("/passports/new");

    await user.type(screen.getByLabelText("Nombre preferido"), "Juan");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Crear un nuevo pasaporte" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Revisa los siguientes campos")).toBeInTheDocument();
  });

  it("cancels without creating a record", async () => {
    const user = userEvent.setup();
    renderAt("/passports/new");

    await user.type(screen.getByLabelText("Nombre preferido"), "Sin guardar");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      await screen.findByRole("heading", { level: 2, name: "Tus pasaportes" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Sin guardar")).not.toBeInTheDocument();
  });

  it("loads the existing demo passport's values for editing", async () => {
    renderAt("/");
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Editar" }));

    expect(await screen.findByLabelText("Nombre preferido")).toHaveValue("Rosa (Doña Rosa)");
  });

  it("saves changes to an existing passport", async () => {
    renderAt("/");
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Editar" }));

    const nameInput = await screen.findByLabelText("Nombre preferido");
    await user.clear(nameInput);
    await user.type(nameInput, "Rosa actualizada");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(
      await screen.findByRole("heading", { level: 2, name: "Tus pasaportes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rosa actualizada")).toBeInTheDocument();
  });
});
