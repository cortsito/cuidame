import { describe, expect, it } from "vitest";
import { createEmptyPassportFormValues } from "./passport";
import {
  OPTIONAL_TEXT_MAX_LENGTH,
  PREFERRED_NAME_MAX_LENGTH,
  trimPassportFormValues,
  validatePassportForm,
} from "./validation";

function validValues() {
  return {
    ...createEmptyPassportFormValues(),
    preferredName: "Rosa",
    consentConfirmed: true,
  };
}

describe("validatePassportForm", () => {
  it("requires a preferred name", () => {
    const errors = validatePassportForm({ ...validValues(), preferredName: "" });
    expect(errors.preferredName).toBeDefined();
  });

  it("requires consent", () => {
    const errors = validatePassportForm({ ...validValues(), consentConfirmed: false });
    expect(errors.consentConfirmed).toBeDefined();
  });

  it("rejects a preferred name longer than the maximum length", () => {
    const tooLong = "a".repeat(PREFERRED_NAME_MAX_LENGTH + 1);
    const errors = validatePassportForm({ ...validValues(), preferredName: tooLong });
    expect(errors.preferredName).toBeDefined();
  });

  it("accepts a preferred name at the maximum length", () => {
    const atLimit = "a".repeat(PREFERRED_NAME_MAX_LENGTH);
    const errors = validatePassportForm({ ...validValues(), preferredName: atLimit });
    expect(errors.preferredName).toBeUndefined();
  });

  it("rejects an optional field longer than the maximum length", () => {
    const tooLong = "a".repeat(OPTIONAL_TEXT_MAX_LENGTH + 1);
    const errors = validatePassportForm({ ...validValues(), communicationNotes: tooLong });
    expect(errors.communicationNotes).toBeDefined();
  });

  it("passes with only the required fields filled in", () => {
    const errors = validatePassportForm(validValues());
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe("trimPassportFormValues", () => {
  it("trims every string field", () => {
    const trimmed = trimPassportFormValues({
      ...validValues(),
      preferredName: "  Rosa  ",
      howToAddress: "  con calma  ",
    });
    expect(trimmed.preferredName).toBe("Rosa");
    expect(trimmed.howToAddress).toBe("con calma");
  });

  it("does not alter the consent boolean", () => {
    const trimmed = trimPassportFormValues({ ...validValues(), consentConfirmed: true });
    expect(trimmed.consentConfirmed).toBe(true);
  });
});
