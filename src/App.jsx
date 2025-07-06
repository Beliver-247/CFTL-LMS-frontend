// App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ParentLogin from "./pages/ParentPages/ParentLogin";
import TeacherLogin from "./pages/TeacherPages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherPages/TeacherDashboard";
import TeacherRegister from "./pages/TeacherPages/TeacherRegister";
import TeacherCompleteProfile from "./pages/TeacherPages/TeacherCompleteProfile";
import ParentRegister from "./pages/ParentPages/ParentRegistration";
import ParentDashboard from "./pages/ParentPages/ParentDashboard";
import StudentRegister from "./pages/StudentPages/StudentRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminPages/AdminLogin";
import AdminCompleteProfile from "./pages/AdminPages/AdminProfileForm";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import CoordinatorDashboard from "./pages/CoordinatorPages/CoordinatorDashboard";
import ManageCourses from "./pages/CoursePages/ManageCourses";
import CreateCourse from "./pages/CoursePages/CreateCourse";
import EditCourse from "./pages/CoursePages/EditCourse";
import CreateSubject from "./pages/CoursePages/CreateSubject";
import ManageSubjects from "./pages/CoursePages/ManageSubjects";
import AdminSetRole from "./pages/AdminPages/AdminSetRole";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import CoordinatorLogin from "./pages/CoordinatorPages/CoordinatorLogin";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute
                element={TeacherDashboard}
                allowedRoles={["teacher"]}
              />
            }
          />
          <Route path="/teacher-register" element={<TeacherRegister />} />
          <Route
            path="/teacher-complete-profile"
            element={<TeacherCompleteProfile />}
          />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route
            path="/coordinator-login"
            element={
              <RedirectIfAuthenticated>
                <CoordinatorLogin />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/admin-login"
            element={
              <RedirectIfAuthenticated>
                <AdminLogin />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/admin-complete-profile"
            element={<AdminCompleteProfile />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                element={AdminDashboard}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/manage-courses"
            element={
              <ProtectedRoute
                element={ManageCourses}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/courses/create"
            element={
              <ProtectedRoute element={CreateCourse} allowedRoles={["admin"]} />
            }
          />
          <Route
            path="/admin/courses/edit/:courseId"
            element={
              <ProtectedRoute element={EditCourse} allowedRoles={["admin"]} />
            }
          />
          <Route
            path="/coordinator-dashboard"
            element={
              <ProtectedRoute
                element={CoordinatorDashboard}
                allowedRoles={["coordinator"]}
              />
            }
          />
          <Route
            path="/admin/set-role"
            element={
              <ProtectedRoute element={AdminSetRole} allowedRoles={["admin"]} />
            }
          />

          <Route path="/admin/subjects/create" element={<CreateSubject />} />
          <Route
            path="/admin/manage-subjects"
            element={
              <ProtectedRoute
                element={ManageSubjects}
                allowedRoles={["admin"]}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
