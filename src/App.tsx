import { Routes, Route } from "react-router-dom";
import "./index.css";
import TeacherListPage from "./pages/admin/TeacherListPage";
import TeacherCreatePage from "./pages/admin/TeacherCreatePage";
import ApplicationListPage from "./pages/admin/ApplicationListPage";
import HomePage from "./pages/user/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/get/teacher" element={<TeacherListPage />} />
      <Route path="/post/teacher" element={<TeacherCreatePage />} />
      <Route path="/get/apply" element={<ApplicationListPage />} />
      <Route path="/apply" element={<HomePage />} />
    </Routes>
  );
}

export default App;