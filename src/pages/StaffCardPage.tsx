import { useParams } from "react-router-dom";

export function StaffCardPage() {
  const { id } = useParams();

  return (
    <section aria-labelledby="staff-card-heading">
      <h2 id="staff-card-heading">Tarjeta para el personal</h2>
      <p>
        Aquí el personal de salud podrá leer, en una vista breve y fácil de escanear, la
        información no clínica que la familia haya registrado para el pasaporte {id}. Esta vista
        todavía no muestra información real ni permite imprimir.
      </p>
    </section>
  );
}
