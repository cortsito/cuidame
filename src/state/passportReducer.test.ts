import { describe, expect, it } from "vitest";
import type { Passport, PassportStore } from "../domain/passport";
import { passportReducer } from "./passportReducer";

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

const emptyStore: PassportStore = { version: 1, passports: [] };

describe("passportReducer", () => {
  it("replaces the whole state on hydrate", () => {
    const hydrated: PassportStore = { version: 1, passports: [makePassport()] };
    const result = passportReducer(emptyStore, { type: "hydrate", payload: hydrated });
    expect(result).toBe(hydrated);
  });

  it("appends a passport on create", () => {
    const passport = makePassport();
    const result = passportReducer(emptyStore, { type: "create", payload: passport });
    expect(result.passports).toEqual([passport]);
  });

  it("appends a passport on duplicate", () => {
    const original = makePassport();
    const copy = makePassport({ id: "id-2", preferredName: "Rosa — copia" });
    const withOriginal: PassportStore = { version: 1, passports: [original] };
    const result = passportReducer(withOriginal, { type: "duplicate", payload: copy });
    expect(result.passports).toEqual([original, copy]);
  });

  it("replaces only the matching passport on update", () => {
    const first = makePassport({ id: "id-1" });
    const second = makePassport({ id: "id-2", preferredName: "Pilar" });
    const state: PassportStore = { version: 1, passports: [first, second] };
    const updatedFirst = { ...first, preferredName: "Rosa actualizada" };
    const result = passportReducer(state, { type: "update", payload: updatedFirst });
    expect(result.passports).toEqual([updatedFirst, second]);
  });

  it("removes only the matching passport on delete", () => {
    const first = makePassport({ id: "id-1" });
    const second = makePassport({ id: "id-2" });
    const state: PassportStore = { version: 1, passports: [first, second] };
    const result = passportReducer(state, { type: "delete", payload: { id: "id-1" } });
    expect(result.passports).toEqual([second]);
  });
});
