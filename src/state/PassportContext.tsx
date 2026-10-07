import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { createPassportId, type Passport, type PassportFormValues, type PassportStore } from "../domain/passport";
import { createDemoPassport } from "../domain/demoPassport";
import { passportReducer } from "./passportReducer";
import { isDemoSeeded, loadStore, markDemoSeeded, saveStore } from "./passportRepository";
import { PassportContext, type PassportContextValue } from "./passportContextStore";

function initializeStore(): PassportStore {
  const stored = loadStore();
  if (stored.passports.length === 0 && !isDemoSeeded()) {
    const now = new Date().toISOString();
    const seeded: PassportStore = { version: 1, passports: [createDemoPassport(now)] };
    saveStore(seeded);
    markDemoSeeded();
    return seeded;
  }
  return stored;
}

export function PassportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(passportReducer, undefined, initializeStore);

  useEffect(() => {
    saveStore(state);
  }, [state]);

  const value = useMemo<PassportContextValue>(() => {
    const createPassport = (values: PassportFormValues): Passport => {
      const now = new Date().toISOString();
      const passport: Passport = { id: createPassportId(), ...values, createdAt: now, updatedAt: now };
      dispatch({ type: "create", payload: passport });
      return passport;
    };

    const updatePassport = (id: string, values: PassportFormValues): Passport | undefined => {
      const existing = state.passports.find((passport) => passport.id === id);
      if (!existing) {
        return undefined;
      }
      const updated: Passport = { ...existing, ...values, updatedAt: new Date().toISOString() };
      dispatch({ type: "update", payload: updated });
      return updated;
    };

    const duplicatePassport = (id: string): Passport | undefined => {
      const existing = state.passports.find((passport) => passport.id === id);
      if (!existing) {
        return undefined;
      }
      const now = new Date().toISOString();
      const copy: Passport = {
        ...existing,
        id: createPassportId(),
        preferredName: `${existing.preferredName} — copia`,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "duplicate", payload: copy });
      return copy;
    };

    const deletePassport = (id: string): void => {
      dispatch({ type: "delete", payload: { id } });
    };

    return {
      passports: state.passports,
      createPassport,
      updatePassport,
      duplicatePassport,
      deletePassport,
    };
  }, [state]);

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}
