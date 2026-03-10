import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Sliders from "./pages/Sliders";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import AuthGuard from "./components/AuthGuard";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/projects",
    element: (
      <AuthGuard>
        <Projects />
      </AuthGuard>
    ),
  },
  {
    path: "/services",
    element: (
      <AuthGuard>
        <Services />
      </AuthGuard>
    ),
  },
  {
    path: "/sliders",
    element: (
      <AuthGuard>
        <Sliders />
      </AuthGuard>
    ),
  },
  {
    path: "/about",
    element: (
      <AuthGuard>
        <AboutUs />
      </AuthGuard>
    ),
  },
]);
