import { Link, useParams } from "react-router-dom";
import { usePassports } from "../state/usePassports";
import { StaffCard } from "../components/StaffCard";

export function StaffCardPage() {
  const { id } = useParams();
  const { passports } = usePassports();
  const passport = passports.find((candidate) => candidate.id === id);

  if (!passport) {
    return (
      <section aria-labelledby="staff-card-heading">
        <h2 id="staff-card-heading">Pasaporte no encontrado</h2>
        <p>No encontramos este pasaporte. Puede que ya se haya eliminado.</p>
      </section>
    );
  }

  return (
    <div>
      <div className="staff-card-actions no-print">
        <Link to={`/passports/${passport.id}/edit`}>Editar</Link>
        <button type="button" onClick={() => window.print()}>
          Imprimir o guardar como PDF
        </button>
        <Link to="/">Volver a pasaportes</Link>
      </div>
      <StaffCard passport={passport} />
    </div>
  );
}
