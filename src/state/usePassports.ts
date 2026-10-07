import { useContext } from "react";
import { PassportContext } from "./passportContextStore";

export function usePassports() {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error("usePassports must be used within a PassportProvider");
  }
  return context;
}
