import { Link } from "react-router-dom";
import { usePassports } from "../state/usePassports";
import { PassportList } from "../components/PassportList";

export function PassportListPage() {
  const { passports, duplicatePassport, deletePassport } = usePassports();

  return (
    <section aria-labelledby="passport-list-heading">
      <h2 id="passport-list-heading">Tus pasaportes</h2>
      <p>
        Aquí puedes crear, revisar y preparar la tarjeta para el personal de salud con la
        información no clínica que la familia haya registrado.
      </p>
      <p className="notice">
        Tus pasaportes se guardan solo en este navegador. Puedes borrarlos cuando quieras desde{" "}
        <Link to="/privacy">Privacidad</Link>.
      </p>
      <div className="page-actions">
        <Link className="action action-primary" to="/passports/new">
          Crear pasaporte
        </Link>
      </div>
      <PassportList passports={passports} onDuplicate={duplicatePassport} onDelete={deletePassport} />
    </section>
  );
}
