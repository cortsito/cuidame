import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PassportList } from "./PassportList";
import type { Passport } from "../domain/passport";

function makePassport(overrides: Partial<Passport> = {}): Passport {
  return {
    id: "id-1",
    preferredName: "Rosa (Doña Rosa)",
    howToAddress: "",
    preferredLanguage: "",
    communicationNotes: "",
    sensorySupports: "",
    calmingRoutines: "",
    stressTriggers: "",
    respectfulSupport: "",
    trustedContactName: "",
    trustedContactRelation: "",
    trustedContactMethod: "",
    consentConfirmed: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function renderList(passports: Passport[], onDuplicate = vi.fn(), onDelete = vi.fn()) {
  render(
    <MemoryRouter>
      <PassportList passports={passports} onDuplicate={onDuplicate} onDelete={onDelete} />
    </MemoryRouter>,
  );
}

describe("PassportList", () => {
  it("shows an empty state when there are no passports", () => {
    renderList([]);
    expect(screen.getByText("Todavía no tienes pasaportes guardados.")).toBeInTheDocument();
  });

  it("lists each passport with its preferred name and actions", () => {
    renderList([makePassport()]);
    expect(screen.getByText("Rosa (Doña Rosa)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Editar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver tarjeta" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Duplicar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
  });

  it("calls onDuplicate when Duplicar is activated", async () => {
    const user = userEvent.setup();
    const onDuplicate = vi.fn();
    renderList([makePassport()], onDuplicate);
    await user.click(screen.getByRole("button", { name: "Duplicar" }));
    expect(onDuplicate).toHaveBeenCalledWith("id-1");
  });

  it("requires confirmation before deleting, and cancel leaves data unchanged", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderList([makePassport()], vi.fn(), onDelete);

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
  });

  it("deletes only after confirming", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderList([makePassport()], vi.fn(), onDelete);

    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    expect(onDelete).toHaveBeenCalledWith("id-1");
  });
});
