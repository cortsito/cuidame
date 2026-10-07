import { useNavigate, useParams } from "react-router-dom";
import { createEmptyPassportFormValues, toPassportFormValues, type PassportFormValues } from "../domain/passport";
import { PassportForm } from "../components/PassportForm";
import { usePassports } from "../state/usePassports";

type PassportFormPageProps = {
  mode: "create" | "edit";
};

export function PassportFormPage({ mode }: PassportFormPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { passports, createPassport, updatePassport } = usePassports();

  const existing = mode === "edit" ? passports.find((passport) => passport.id === id) : undefined;

  if (mode === "edit" && !existing) {
    return (
      <section aria-labelledby="passport-form-heading">
        <h2 id="passport-form-heading">Pasaporte no encontrado</h2>
        <p>No encontramos este pasaporte. Puede que ya se haya eliminado.</p>
      </section>
    );
  }

  const heading = mode === "create" ? "Crear un nuevo pasaporte" : "Editar pasaporte";
  const submitLabel = mode === "create" ? "Guardar" : "Guardar cambios";
  const initialValues = existing ? toPassportFormValues(existing) : createEmptyPassportFormValues();

  const handleSubmit = (values: PassportFormValues) => {
    if (mode === "create") {
      createPassport(values);
    } else if (existing) {
      updatePassport(existing.id, values);
    }
    navigate("/");
  };

  return (
    <section aria-labelledby="passport-form-heading">
      <h2 id="passport-form-heading">{heading}</h2>
      <p>
        Este formulario no es un expediente médico; registra solo información de apoyo para
        comunicarse con respeto.
      </p>
      <PassportForm
        initialValues={initialValues}
        submitLabel={submitLabel}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </section>
  );
}
