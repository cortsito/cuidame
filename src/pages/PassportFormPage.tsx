import { useParams } from "react-router-dom";

type PassportFormPageProps = {
  mode: "create" | "edit";
};

export function PassportFormPage({ mode }: PassportFormPageProps) {
  const { id } = useParams();
  const heading = mode === "create" ? "Crear un nuevo pasaporte" : "Editar pasaporte";

  return (
    <section aria-labelledby="passport-form-heading">
      <h2 id="passport-form-heading">{heading}</h2>
      {mode === "create" ? (
        <p>
          Aquí vas a poder registrar cómo le gusta que le llamen, cómo comunicarse y qué le
          ayuda a sentirse en calma. Este formulario no es un expediente médico y todavía no
          guarda información.
        </p>
      ) : (
        <p>
          Aquí vas a poder actualizar la información del pasaporte {id}. Todavía no se carga ni
          se guarda ningún dato.
        </p>
      )}
    </section>
  );
}
