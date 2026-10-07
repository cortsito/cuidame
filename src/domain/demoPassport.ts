import { createPassportId, type Passport } from "./passport";

export function createDemoPassport(timestamp: string): Passport {
  return {
    id: createPassportId(),
    preferredName: "Rosa (Doña Rosa)",
    howToAddress:
      "Háblele de frente, con frases cortas y con un tono tranquilo. Déjele tiempo para responder.",
    preferredLanguage: "Español.",
    communicationNotes:
      "Le ayuda saber quién le habla y qué ocurrirá antes de comenzar una conversación.",
    sensorySupports: "Usa lentes y prefiere tenerlos a la mano.",
    calmingRoutines: "Se tranquiliza al escuchar boleros suaves y al hablar de sus plantas.",
    stressTriggers:
      "Los ruidos fuertes, las prisas y no saber qué está pasando pueden inquietarla.",
    respectfulSupport:
      "Preséntese por su nombre, explíquele un paso a la vez y confirme si desea hacer una pausa.",
    trustedContactName: "Pilar Salgado",
    trustedContactRelation: "Hija",
    trustedContactMethod: "Contacto de ejemplo: 55 0000 0000",
    consentConfirmed: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
