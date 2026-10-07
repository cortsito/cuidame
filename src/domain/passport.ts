export type Passport = {
  id: string;
  preferredName: string;
  howToAddress: string;
  preferredLanguage: string;
  communicationNotes: string;
  sensorySupports: string;
  calmingRoutines: string;
  stressTriggers: string;
  respectfulSupport: string;
  trustedContactName: string;
  trustedContactRelation: string;
  trustedContactMethod: string;
  consentConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PassportStore = {
  version: 1;
  passports: Passport[];
};

export type PassportFormValues = {
  preferredName: string;
  howToAddress: string;
  preferredLanguage: string;
  communicationNotes: string;
  sensorySupports: string;
  calmingRoutines: string;
  stressTriggers: string;
  respectfulSupport: string;
  trustedContactName: string;
  trustedContactRelation: string;
  trustedContactMethod: string;
  consentConfirmed: boolean;
};

export function createEmptyPassportFormValues(): PassportFormValues {
  return {
    preferredName: "",
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
    consentConfirmed: false,
  };
}

export function toPassportFormValues(passport: Passport): PassportFormValues {
  return {
    preferredName: passport.preferredName,
    howToAddress: passport.howToAddress,
    preferredLanguage: passport.preferredLanguage,
    communicationNotes: passport.communicationNotes,
    sensorySupports: passport.sensorySupports,
    calmingRoutines: passport.calmingRoutines,
    stressTriggers: passport.stressTriggers,
    respectfulSupport: passport.respectfulSupport,
    trustedContactName: passport.trustedContactName,
    trustedContactRelation: passport.trustedContactRelation,
    trustedContactMethod: passport.trustedContactMethod,
    consentConfirmed: passport.consentConfirmed,
  };
}

export function createPassportId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `passport-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
