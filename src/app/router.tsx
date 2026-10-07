import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { PassportListPage } from "../pages/PassportListPage";
import { PassportFormPage } from "../pages/PassportFormPage";
import { StaffCardPage } from "../pages/StaffCardPage";
import { PrivacyPage } from "../pages/PrivacyPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <PassportListPage /> },
      { path: "passports/new", element: <PassportFormPage mode="create" /> },
      { path: "passports/:id/edit", element: <PassportFormPage mode="edit" /> },
      { path: "passports/:id/card", element: <StaffCardPage /> },
      { path: "privacy", element: <PrivacyPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
