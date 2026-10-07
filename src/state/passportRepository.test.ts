import { beforeEach, describe, expect, it } from "vitest";
import type { Passport, PassportStore } from "../domain/passport";
import { OPTIONAL_TEXT_MAX_LENGTH } from "../domain/validation";
import { isDemoSeeded, loadStore, markDemoSeeded, saveStore } from "./passportRepository";

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

function storeWith(passport: Passport): PassportStore {
  return { version: 1, passports: [passport] };
}

describe("passportRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty valid store when nothing is stored", () => {
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("round-trips a valid store", () => {
    const store: PassportStore = { version: 1, passports: [makePassport()] };
    saveStore(store);
    expect(loadStore()).toEqual(store);
  });

  it("returns an empty valid store when the stored JSON is not parseable", () => {
    localStorage.setItem("cuidame.passports.v1", "{not json");
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("returns an empty valid store when the record shape is malformed", () => {
    localStorage.setItem(
      "cuidame.passports.v1",
      JSON.stringify({ version: 1, passports: [{ id: "only-an-id" }] }),
    );
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("returns an empty valid store when the version does not match", () => {
    localStorage.setItem(
      "cuidame.passports.v1",
      JSON.stringify({ version: 2, passports: [] }),
    );
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("returns an empty valid store when a persisted passport has an empty preferred name", () => {
    localStorage.setItem(
      "cuidame.passports.v1",
      JSON.stringify(storeWith(makePassport({ preferredName: "   " }))),
    );
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("returns an empty valid store when a persisted passport has consent set to false", () => {
    localStorage.setItem(
      "cuidame.passports.v1",
      JSON.stringify(storeWith(makePassport({ consentConfirmed: false }))),
    );
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("returns an empty valid store when a persisted passport has an over-length optional field", () => {
    localStorage.setItem(
      "cuidame.passports.v1",
      JSON.stringify(
        storeWith(makePassport({ communicationNotes: "a".repeat(OPTIONAL_TEXT_MAX_LENGTH + 1) })),
      ),
    );
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("returns an empty valid store when a persisted passport has an invalid timestamp", () => {
    localStorage.setItem(
      "cuidame.passports.v1",
      JSON.stringify(storeWith(makePassport({ updatedAt: "not-a-date" }))),
    );
    expect(loadStore()).toEqual({ version: 1, passports: [] });
  });

  it("tracks whether the demo has been seeded", () => {
    expect(isDemoSeeded()).toBe(false);
    markDemoSeeded();
    expect(isDemoSeeded()).toBe(true);
  });
});
