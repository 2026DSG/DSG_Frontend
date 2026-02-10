import { Routes, Route } from "react-router-dom";
import "./index.css";
import TeacherListPage from "./pages/admin/TeacherListPage";
import TeacherCreatePage from "./pages/admin/TeacherCreatePage";
import ApplicationListPage from "./pages/admin/ApplicationListPage";

function App() {
  return (
    <Routes>
      <Route path="/get/teacher" element={<TeacherListPage />} />
      <Route path="/post/teacherCreate" element={<TeacherCreatePage />} />
      <Route path="/get/apply" element={<ApplicationListPage />} />
    </Routes>
  );
}

export default App;