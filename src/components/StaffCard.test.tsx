import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Passport } from "../domain/passport";
import { StaffCard } from "./StaffCard";

function makePassport(overrides: Partial<Passport> = {}): Passport {
  return {
    id: "id-1",
    preferredName: "Rosa",
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

describe("StaffCard", () => {
  it("renders the preferred name and every populated group and field", () => {
    const passport = makePassport({
      howToAddress: "Háblele con calma.",
      calmingRoutines: "Escuchar música suave.",
      stressTriggers: "Los ruidos fuertes.",
      trustedContactName: "Pilar Salgado",
    });
    render(<StaffCard passport={passport} />);

    expect(screen.getByRole("heading", { level: 2, name: "Rosa" })).toBeInTheDocument();
    expect(screen.getByText("Háblele con calma.")).toBeInTheDocument();
    expect(screen.getByText("Escuchar música suave.")).toBeInTheDocument();
    expect(screen.getByText("Los ruidos fuertes.")).toBeInTheDocument();
    expect(screen.getByText("Pilar Salgado")).toBeInTheDocument();
  });

  it("omits an empty group's heading and labels", () => {
    const passport = makePassport({ calmingRoutines: "Escuchar música suave." });
    render(<StaffCard passport={passport} />);

    expect(
      screen.queryByRole("heading", { level: 3, name: "Situaciones difíciles y apoyo respetuoso" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Persona de confianza" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Relación:", { exact: false })).not.toBeInTheDocument();
  });

  it("renders only the safety reminder and no groups when every optional field is empty", () => {
    const passport = makePassport();
    render(<StaffCard passport={passport} />);

    expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Esta tarjeta apoya la comunicación y no sustituye el expediente clínico ni la valoración del personal de salud.",
      ),
    ).toBeInTheDocument();
  });
});
