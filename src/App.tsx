import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import AuthPage from "./pages/AuthPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Dashboard from "./pages/Dashboard";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Handle email verification and password reset routes */}
        <Route path="/auth/verify" element={<AuthPage />} />
        <Route path="/auth/reset-password" element={<AuthPage />} />
        {/* Allow Tempo routes to pass through */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
