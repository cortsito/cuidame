import type { Passport, PassportStore } from "../domain/passport";
import { OPTIONAL_TEXT_MAX_LENGTH, PREFERRED_NAME_MAX_LENGTH } from "../domain/validation";

const STORE_KEY = "cuidame.passports.v1";
const SEED_KEY = "cuidame.demo-seeded.v1";

const EMPTY_STORE: PassportStore = { version: 1, passports: [] };

const PASSPORT_STRING_FIELDS: Array<keyof Passport> = [
  "id",
  "preferredName",
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
  "createdAt",
  "updatedAt",
];

const OPTIONAL_TEXT_FIELDS: Array<keyof Passport> = [
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
];

function isValidIsoTimestamp(value: string): boolean {
  return value.trim() !== "" && !Number.isNaN(Date.parse(value));
}

function isValidPassport(value: unknown): value is Passport {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;

  const hasValidStrings = PASSPORT_STRING_FIELDS.every(
    (field) => typeof record[field] === "string",
  );
  if (!hasValidStrings || record.consentConfirmed !== true) {
    return false;
  }

  const id = record.id as string;
  if (id.trim() === "") {
    return false;
  }

  const preferredName = (record.preferredName as string).trim();
  if (preferredName === "" || preferredName.length > PREFERRED_NAME_MAX_LENGTH) {
    return false;
  }

  const hasValidOptionalLengths = OPTIONAL_TEXT_FIELDS.every(
    (field) => (record[field] as string).length <= OPTIONAL_TEXT_MAX_LENGTH,
  );
  if (!hasValidOptionalLengths) {
    return false;
  }

  return (
    isValidIsoTimestamp(record.createdAt as string) && isValidIsoTimestamp(record.updatedAt as string)
  );
}

function isValidStore(value: unknown): value is PassportStore {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    record.version === 1 && Array.isArray(record.passports) && record.passports.every(isValidPassport)
  );
}

export function loadStore(): PassportStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      return EMPTY_STORE;
    }
    const parsed = JSON.parse(raw);
    return isValidStore(parsed) ? parsed : EMPTY_STORE;
  } catch {
    return EMPTY_STORE;
  }
}

export function saveStore(store: PassportStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function isDemoSeeded(): boolean {
  return localStorage.getItem(SEED_KEY) === "true";
}

export function markDemoSeeded(): void {
  localStorage.setItem(SEED_KEY, "true");
}
