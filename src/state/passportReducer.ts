import type { Passport, PassportStore } from "../domain/passport";

export type PassportAction =
  | { type: "hydrate"; payload: PassportStore }
  | { type: "create"; payload: Passport }
  | { type: "update"; payload: Passport }
  | { type: "duplicate"; payload: Passport }
  | { type: "delete"; payload: { id: string } }
  | { type: "clear-all" };

export function passportReducer(state: PassportStore, action: PassportAction): PassportStore {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "create":
    case "duplicate":
      return { ...state, passports: [...state.passports, action.payload] };
    case "update":
      return {
        ...state,
        passports: state.passports.map((passport) =>
          passport.id === action.payload.id ? action.payload : passport,
        ),
      };
    case "delete":
      return {
        ...state,
        passports: state.passports.filter((passport) => passport.id !== action.payload.id),
      };
    case "clear-all":
      return { version: 1, passports: [] };
    default:
      return state;
  }
}
