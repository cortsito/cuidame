import { NavLink, Outlet } from "react-router-dom";
import { APP_NAME } from "../config/brand";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{APP_NAME}</h1>
        <p>Un pasaporte de comunicación local para acompañar una estancia hospitalaria.</p>
      </header>
      <nav aria-label="Navegación principal" className="app-nav">
        <NavLink to="/" end>
          Pasaportes
        </NavLink>
        <NavLink to="/passports/new">Crear pasaporte</NavLink>
        <NavLink to="/privacy">Privacidad</NavLink>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>{APP_NAME} es una herramienta de apoyo local y no sustituye el expediente clínico ni la valoración del personal de salud.</p>
      </footer>
    </div>
  );
}
