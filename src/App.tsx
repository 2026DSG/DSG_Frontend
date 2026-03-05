import { Routes, Route } from "react-router-dom";
import "./index.css";
import TeacherListPage from "./pages/admin/TeacherListPage";
import TeacherCreatePage from "./pages/admin/TeacherCreatePage";
import ApplicationListPage from "./pages/admin/ApplicationListPage";
import HomePage from "./pages/user/HomePage";
import ApplicationReasonPage from "./pages/user/ApplicationReasonPage";
import ApplicationTeacherPage from "./pages/user/ApplicationTeacherPage";

function App() {
  return (
    <Routes>
      <Route path="/admin/teachers" element={<TeacherListPage />} />
      <Route path="/admin/teachers/new" element={<TeacherCreatePage />} />
      <Route path="/admin/apply" element={<ApplicationListPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/apply/reason" element={<ApplicationReasonPage />} />
      <Route path="/apply/teacher" element={<ApplicationTeacherPage />} />
    </Routes>
  );
}

export default App;