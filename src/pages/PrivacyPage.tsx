import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../config/brand";
import { usePassports } from "../state/usePassports";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function PrivacyPage() {
  const { clearAllPassports } = usePassports();
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    clearAllPassports();
    setConfirming(false);
    navigate("/");
  };

  return (
    <section aria-labelledby="privacy-heading">
      <h2 id="privacy-heading">Privacidad y datos locales</h2>
      <p>
        Tus pasaportes se guardan solo en este navegador, mediante almacenamiento local. No se
        envían a ningún servidor ni se comparten con nadie.
      </p>
      <p>
        Si borras los datos de este navegador o usas «Borrar todos los pasaportes», la
        información se elimina de este dispositivo.
      </p>
      <p className="notice">
        {APP_NAME} no es un expediente médico. No registres aquí diagnósticos, medicamentos,
        alergias ni otra información clínica.
      </p>
      <div className="danger-zone">
        {confirming ? (
          <ConfirmDialog
            message="¿Borrar todos los pasaportes guardados en este navegador? Esta acción no se puede deshacer."
            confirmLabel="Borrar todos los pasaportes"
            cancelLabel="Cancelar"
            onCancel={() => setConfirming(false)}
            onConfirm={handleConfirm}
          />
        ) : (
          <button type="button" className="action action-danger" onClick={() => setConfirming(true)}>
            Borrar todos los pasaportes
          </button>
        )}
      </div>
    </section>
  );
}
