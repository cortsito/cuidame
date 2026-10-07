import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { PassportProvider } from "../state/PassportContext";

export function App() {
  return (
    <PassportProvider>
      <RouterProvider router={router} />
    </PassportProvider>
  );
}
