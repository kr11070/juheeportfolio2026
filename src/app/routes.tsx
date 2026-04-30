import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { AuthPage } from "./pages/AuthPage";
import { LanguageProvider } from "./context/LanguageContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LanguageProvider>
        <MainLayout />
      </LanguageProvider>
    ),
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "project/:id",
        Component: ProjectDetail,
      },
      {
        path: "auth",
        Component: AuthPage,
      },
    ],
  },
]);
