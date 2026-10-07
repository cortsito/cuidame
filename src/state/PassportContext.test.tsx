import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PassportProvider } from "./PassportContext";
import { usePassports } from "./usePassports";
import { createEmptyPassportFormValues } from "../domain/passport";
import { isDemoSeeded, loadStore } from "./passportRepository";

function Harness() {
  const {
    passports,
    createPassport,
    updatePassport,
    duplicatePassport,
    deletePassport,
    clearAllPassports,
  } = usePassports();

  return (
    <div>
      <p data-testid="count">{passports.length}</p>
      <ul>
        {passports.map((passport) => (
          <li key={passport.id} data-testid="passport">
            {passport.preferredName}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          createPassport({
            ...createEmptyPassportFormValues(),
            preferredName: "Nuevo pasaporte",
            consentConfirmed: true,
          })
        }
      >
        crear
      </button>
      <button
        type="button"
        onClick={() => {
          const first = passports[0];
          if (first) {
            updatePassport(first.id, { ...createEmptyPassportFormValues(), preferredName: "Actualizado", consentConfirmed: true });
          }
        }}
      >
        actualizar
      </button>
      <button
        type="button"
        onClick={() => {
          const first = passports[0];
          if (first) {
            duplicatePassport(first.id);
          }
        }}
      >
        duplicar
      </button>
      <button
        type="button"
        onClick={() => {
          const first = passports[0];
          if (first) {
            deletePassport(first.id);
          }
        }}
      >
        eliminar
      </button>
      <button type="button" onClick={clearAllPassports}>
        borrar todo
      </button>
    </div>
  );
}

describe("PassportProvider", () => {
  it("seeds the demo passport only when storage is empty and unseeded", () => {
    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByText("Rosa (Doña Rosa)")).toBeInTheDocument();
    expect(isDemoSeeded()).toBe(true);
  });

  it("does not reseed after every passport has been deleted", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "eliminar" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(loadStore().passports).toHaveLength(0);
    unmount();

    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("creates a new passport with a fresh id and persists it", async () => {
    const user = userEvent.setup();
    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "crear" }));
    expect(screen.getByText("Nuevo pasaporte")).toBeInTheDocument();
    expect(loadStore().passports.some((p) => p.preferredName === "Nuevo pasaporte")).toBe(true);
  });

  it("updates an existing passport", async () => {
    const user = userEvent.setup();
    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "actualizar" }));
    expect(screen.getByText("Actualizado")).toBeInTheDocument();
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });

  it("duplicates a passport with a distinct name and an independent id", async () => {
    const user = userEvent.setup();
    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "duplicar" }));
    expect(screen.getByTestId("count")).toHaveTextContent("2");
    const names = screen.getAllByTestId("passport").map((node) => node.textContent);
    expect(names).toContain("Rosa (Doña Rosa) — copia");
  });

  it("persists state to local storage after reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "actualizar" }));
    unmount();

    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    expect(screen.getByText("Actualizado")).toBeInTheDocument();
  });

  it("clears every passport and persists the empty store", async () => {
    const user = userEvent.setup();
    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "borrar todo" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(loadStore().passports).toHaveLength(0);
  });

  it("keeps the demo marked as seeded after clear-all so it does not reappear on reload", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    await user.click(screen.getByRole("button", { name: "borrar todo" }));
    expect(isDemoSeeded()).toBe(true);
    unmount();

    render(
      <PassportProvider>
        <Harness />
      </PassportProvider>,
    );
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});
