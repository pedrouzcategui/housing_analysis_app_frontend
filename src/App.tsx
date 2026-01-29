import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPage } from "./pages/AdminPage";
import { ListingsDashboardPage } from "./pages/ListingsDashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListingsDashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
