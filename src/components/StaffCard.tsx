import type { Passport } from "../domain/passport";

type StaffCardProps = {
  passport: Passport;
};

type OptionalTextField = Exclude<
  keyof Passport,
  "id" | "preferredName" | "consentConfirmed" | "createdAt" | "updatedAt"
>;

type FieldSpec = {
  field: OptionalTextField;
  label: string;
};

type GroupSpec = {
  title: string;
  fields: FieldSpec[];
};

const GROUPS: GroupSpec[] = [
  {
    title: "Cómo comunicarse",
    fields: [
      { field: "howToAddress", label: "Así prefiere que le hablen" },
      { field: "preferredLanguage", label: "Idioma o forma de comunicación preferida" },
      { field: "communicationNotes", label: "Qué ayuda al comunicarse" },
      { field: "sensorySupports", label: "Apoyos personales" },
    ],
  },
  {
    title: "Lo que le ayuda a sentirse en calma",
    fields: [{ field: "calmingRoutines", label: "Lo que le da calma o confianza" }],
  },
  {
    title: "Situaciones difíciles y apoyo respetuoso",
    fields: [
      { field: "stressTriggers", label: "Situaciones que pueden causarle estrés" },
      { field: "respectfulSupport", label: "Cómo acompañarle con respeto" },
    ],
  },
  {
    title: "Persona de confianza",
    fields: [
      { field: "trustedContactName", label: "Persona de confianza" },
      { field: "trustedContactRelation", label: "Relación" },
      { field: "trustedContactMethod", label: "Forma de contacto" },
    ],
  },
];

const printDateFormatter = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" });

export function StaffCard({ passport }: StaffCardProps) {
  return (
    <article className="staff-card" aria-labelledby="staff-card-title">
      <h2 id="staff-card-title">{passport.preferredName}</h2>
      {GROUPS.map((group) => {
        const populatedFields = group.fields.filter((spec) => passport[spec.field]);
        if (populatedFields.length === 0) {
          return null;
        }
        return (
          <section key={group.title} className="staff-card-group">
            <h3>{group.title}</h3>
            {populatedFields.map((spec) => (
              <p key={spec.field} className="staff-card-field">
                <strong>{spec.label}:</strong> {passport[spec.field]}
              </p>
            ))}
          </section>
        );
      })}
      <p className="staff-card-safety">
        Esta tarjeta apoya la comunicación y no sustituye el expediente clínico ni la valoración
        del personal de salud.
      </p>
      <p className="print-date">Fecha de impresión: {printDateFormatter.format(new Date())}</p>
    </article>
  );
}
