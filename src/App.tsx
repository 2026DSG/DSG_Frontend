import { Routes, Route } from "react-router-dom";
import "./index.css";
import TeacherListPage from "./pages/admin/TeacherListPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherListPage />} />
      <Route />
    </Routes>
  );
}

export default App;