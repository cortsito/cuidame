import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PassportForm } from "./PassportForm";
import { createEmptyPassportFormValues } from "../domain/passport";

describe("PassportForm", () => {
  it("blocks save and shows an error summary when required fields are missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <PassportForm
        initialValues={createEmptyPassportFormValues()}
        submitLabel="Guardar"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Revisa los siguientes campos")).toBeInTheDocument();
    const nameInput = screen.getByLabelText("Nombre preferido");
    expect(nameInput).toHaveAccessibleDescription(/nombre preferido/i);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
  });

  it("saves trimmed values once the required fields are provided", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <PassportForm
        initialValues={createEmptyPassportFormValues()}
        submitLabel="Guardar"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText("Nombre preferido"), "  Rosa  ");
    await user.click(
      screen.getByLabelText("Confirmo que tengo autorización para registrar esta información."),
    );
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].preferredName).toBe("Rosa");
    expect(onSubmit.mock.calls[0][0].consentConfirmed).toBe(true);
  });

  it("calls onCancel without submitting when cancel is activated", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <PassportForm
        initialValues={createEmptyPassportFormValues()}
        submitLabel="Guardar"
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("loads existing values for editing", () => {
    render(
      <PassportForm
        initialValues={{
          ...createEmptyPassportFormValues(),
          preferredName: "Rosa (Doña Rosa)",
          consentConfirmed: true,
        }}
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Nombre preferido")).toHaveValue("Rosa (Doña Rosa)");
    expect(
      screen.getByLabelText("Confirmo que tengo autorización para registrar esta información."),
    ).toBeChecked();
  });
});
