import { createContext } from "react";
import type { Passport, PassportFormValues } from "../domain/passport";

export type PassportContextValue = {
  passports: Passport[];
  createPassport: (values: PassportFormValues) => Passport;
  updatePassport: (id: string, values: PassportFormValues) => Passport | undefined;
  duplicatePassport: (id: string) => Passport | undefined;
  deletePassport: (id: string) => void;
  clearAllPassports: () => void;
};

export const PassportContext = createContext<PassportContextValue | undefined>(undefined);
