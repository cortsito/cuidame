import type { PassportFormValues } from "./passport";

export const PREFERRED_NAME_MAX_LENGTH = 80;
export const OPTIONAL_TEXT_MAX_LENGTH = 500;

const OPTIONAL_TEXT_FIELDS = [
  "howToAddress",
  "preferredLanguage",
  "communicationNotes",
  "sensorySupports",
  "calmingRoutines",
  "stressTriggers",
  "respectfulSupport",
  "trustedContactName",
  "trustedContactRelation",
  "trustedContactMethod",
] as const;

export type PassportFormErrors = Partial<Record<keyof PassportFormValues, string>>;

export function trimPassportFormValues(values: PassportFormValues): PassportFormValues {
  const trimmed = { ...values, preferredName: values.preferredName.trim() };
  for (const field of OPTIONAL_TEXT_FIELDS) {
    trimmed[field] = values[field].trim();
  }
  return trimmed;
}

export function validatePassportForm(values: PassportFormValues): PassportFormErrors {
  const errors: PassportFormErrors = {};

  if (!values.preferredName) {
    errors.preferredName = "Escribe el nombre preferido.";
  } else if (values.preferredName.length > PREFERRED_NAME_MAX_LENGTH) {
    errors.preferredName = `Usa como máximo ${PREFERRED_NAME_MAX_LENGTH} caracteres.`;
  }

  for (const field of OPTIONAL_TEXT_FIELDS) {
    if (values[field].length > OPTIONAL_TEXT_MAX_LENGTH) {
      errors[field] = `Usa como máximo ${OPTIONAL_TEXT_MAX_LENGTH} caracteres.`;
    }
  }

  if (!values.consentConfirmed) {
    errors.consentConfirmed = "Confirma que tienes autorización para registrar esta información.";
  }

  return errors;
}

export function isPassportFormValid(errors: PassportFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
