import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import AuthPage from "./pages/AuthPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Dashboard from "./pages/Dashboard";
import routes from "tempo-routes";

function App() {
  // Create a component that uses the routes
  const TempoRoutes = () => useRoutes(routes);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add a catch-all route for Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<></>} />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && <TempoRoutes />}
      </>
    </Suspense>
  );
}

export default App;
