import { useState } from "react";
import { Link } from "react-router-dom";
import type { Passport } from "../domain/passport";
import { ConfirmDialog } from "./ConfirmDialog";

type PassportListProps = {
  passports: Passport[];
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

const updatedAtFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function PassportList({ passports, onDuplicate, onDelete }: PassportListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (passports.length === 0) {
    return <p>Todavía no tienes pasaportes guardados.</p>;
  }

  return (
    <ul className="passport-list">
      {passports.map((passport) => (
        <li key={passport.id} className="passport-list-item">
          <p className="passport-name">{passport.preferredName}</p>
          <p className="passport-updated">
            Última actualización: {updatedAtFormatter.format(new Date(passport.updatedAt))}
          </p>
          {confirmingId === passport.id ? (
            <ConfirmDialog
              message={`¿Eliminar el pasaporte de ${passport.preferredName}? Esta acción no se puede deshacer.`}
              confirmLabel="Eliminar"
              cancelLabel="Cancelar"
              onCancel={() => setConfirmingId(null)}
              onConfirm={() => {
                onDelete(passport.id);
                setConfirmingId(null);
              }}
            />
          ) : (
            <div className="passport-actions">
              <Link to={`/passports/${passport.id}/edit`}>Editar</Link>
              <Link to={`/passports/${passport.id}/card`}>Ver tarjeta</Link>
              <button type="button" onClick={() => onDuplicate(passport.id)}>
                Duplicar
              </button>
              <button type="button" onClick={() => setConfirmingId(passport.id)}>
                Eliminar
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
