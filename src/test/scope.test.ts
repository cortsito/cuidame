import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";
import { createEmptyPassportFormValues } from "../domain/passport";

const allSources = import.meta.glob<string>("../**/*.{ts,tsx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

function isProductionSource(path: string): boolean {
  const isTestFile = /\.test\.tsx?$/.test(path);
  const isTestSupport = path.startsWith("./") || path.startsWith("../test/");
  return !isTestFile && !isTestSupport;
}

const productionSources = Object.entries(allSources).filter(([path]) => isProductionSource(path));

const APPROVED_RUNTIME_PACKAGES = ["react", "react-dom", "react-router-dom"];
const APPROVED_IMPORTS = ["react", "react-dom/client", "react-router-dom"];

const IMPORT_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g;

const NETWORK_MECHANISMS =
  /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bsendBeacon\b|\bRTCPeerConnection\b/;

const PROHIBITED_LABEL_TERMS =
  /diagn[oó]stic|condici[oó]n|medicament|medicaci[oó]n|alergi|al[eé]rgic|restricci[oó]n alimentaria|dieta|movilidad|riesgo|s[ií]ntoma|tratamiento|\borden(es)?\b|historial|antecedentes|signos vitales|padecimiento|enfermedad/i;

const PROHIBITED_FIELD_NAMES =
  /diagnos|condition|medication|medicine|allerg|diet|mobility|risk|symptom|treatment|order|history|vital/i;

const LABEL_PATTERNS = [
  /<(label|legend)\b[^>]*>([\s\S]*?)<\/\1>/g,
  /\b(?:label|title):\s*"([^"]+)"/g,
  /renderTextField\(\s*"[^"]+",\s*"([^"]+)"/g,
];

function collectLabels(source: string): string[] {
  const labels: string[] = [];
  for (const pattern of LABEL_PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      labels.push(match[match.length - 1]);
    }
  }
  return labels;
}

describe("static scope checks", () => {
  it("inspects production source and excludes tests", () => {
    const paths = productionSources.map(([path]) => path);
    expect(paths).toContain("../state/PassportContext.tsx");
    expect(paths).toContain("../components/PassportForm.tsx");
    expect(paths).toContain("../main.tsx");
    expect(paths.some((path) => path.includes(".test."))).toBe(false);
    expect(paths.some((path) => path.endsWith("setup.ts"))).toBe(false);
  });

  it("declares only the approved runtime dependencies", () => {
    expect(Object.keys(packageJson.dependencies).sort()).toEqual(APPROVED_RUNTIME_PACKAGES);
  });

  it("imports only the approved external packages in production source", () => {
    const unapproved: string[] = [];
    for (const [path, source] of productionSources) {
      for (const match of source.matchAll(IMPORT_SPECIFIER)) {
        const specifier = match[1];
        if (!specifier.startsWith(".") && !APPROVED_IMPORTS.includes(specifier)) {
          unapproved.push(`${path}: ${specifier}`);
        }
      }
    }
    expect(unapproved).toEqual([]);
  });

  it("does not use network-request mechanisms in production source", () => {
    const offenders = productionSources
      .filter(([, source]) => NETWORK_MECHANISMS.test(source))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });

  it("does not label any field or section with a prohibited clinical term", () => {
    const labels = productionSources.flatMap(([, source]) => collectLabels(source));
    expect(labels).toContain("Nombre preferido");
    expect(labels).toContain("Cómo llamarle");
    expect(labels).toContain("Apoyos personales");
    expect(labels.some((label) => label.includes("Confirmo que tengo autorización"))).toBe(true);

    expect(labels.filter((label) => PROHIBITED_LABEL_TERMS.test(label))).toEqual([]);
  });

  it("does not define clinical passport fields", () => {
    const fieldNames = Object.keys(createEmptyPassportFormValues());
    expect(fieldNames).toContain("preferredName");
    expect(fieldNames.filter((name) => PROHIBITED_FIELD_NAMES.test(name))).toEqual([]);
  });
});
