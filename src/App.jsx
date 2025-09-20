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
import TeacherProtectedRoute from "./components/TeacherProtectedRoute";
import AdminLogin from "./pages/AdminPages/AdminLogin";
import AdminCompleteProfile from "./pages/AdminPages/AdminProfileForm";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminPaymentRequests from "./pages/AdminPages/AdminPaymentRequests";
import CoordinatorDashboard from "./pages/CoordinatorPages/CoordinatorDashboard";
import ManageCourses from "./pages/CoursePages/ManageCourses";
import CreateCourse from "./pages/CoursePages/CreateCourse";
import EditCourse from "./pages/CoursePages/EditCourse";
import CreateSubject from "./pages/CoursePages/CreateSubject";
import ManageSubjects from "./pages/CoursePages/ManageSubjects";
import AdminSetRole from "./pages/AdminPages/AdminSetRole";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import CoordinatorLogin from "./pages/CoordinatorPages/CoordinatorLogin";
import CourseEnrolledStudents from "./pages/CoordinatorPages/CourseEnrolledStudents";
import EnrollStudentsToCourse from "./pages/CoordinatorPages/EnrollStudentsToCourse";
import EditStudent from "./pages/StudentPages/EditStudent";
import ManageStudents from "./pages/StudentPages/ManageStudents";
import EnrolledStudents from "./pages/CoordinatorPages/EnrolledStudents";
import StudentDetails from "./pages/StudentPages/StudentDetails";
import PaymentStatusMy from "./pages/ParentPages/PaymentStatusMy";
import ManagePaymentRequests from "./pages/CoordinatorPages/ManagePaymentRequests";
import ViewPaymentStatus from "./pages/ParentPages/ViewPaymentStatus";
import UserLogin from "./pages/UserLogin";
import ViewRegistrationRequests from "./pages/AdminPages/ViewRegistrationRequests";
import SyllabusCourseList from "./pages/AdminPages/syllabusCourseList";
import ManageCourseSyllabus from "./pages/AdminPages/ManageCourseSyllabus";
import AssignCoursesToTeacher from "./pages/AdminPages/AssignCoursesToTeachers";
import TeacherModules from "./pages/TeacherPages/TeacherModules";
import UpdateCourseStatus from "./pages/TeacherPages/UpdateCourseStatus";
import CoordinatorSyllabusApproval from "./pages/CoordinatorPages/CoordinatorSyllabusApproval";
import PendingRegistrations from "./pages/AdminPages/PendingRegistrations";
import CoordinatorPendingRegistrations from "./pages/CoordinatorPages/CoordinatorPendingRegistrations";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-register" element={<TeacherRegister />} />
          <Route
            path="/teacher-complete-profile"
            element={<TeacherCompleteProfile />}
          />
          <Route path="/teacher-modules" element={<TeacherModules />} />
          <Route
            path="/teacher/courses/:courseId/update-status"
            element={<TeacherProtectedRoute element={UpdateCourseStatus} />}
          />
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/payment-status" element={<PaymentStatusMy />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route
            path="/view-payment-requests"
            element={<ViewPaymentStatus />}
          />
          <Route
            path="/admin/manage-students"
            element={
              <ProtectedRoute
                element={ManageStudents}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/coordinator/courses/:courseId/approve-syllabus"
            element={
              <ProtectedRoute
                element={CoordinatorSyllabusApproval}
                allowedRoles={["coordinator"]}
              />
            }
          />

          <Route
            path="/coordinator/manage-payment-requests"
            element={
              <ProtectedRoute
                element={ManagePaymentRequests}
                allowedRoles={["coordinator"]}
              />
            }
          />

          <Route
            path="/admin/students/:id/edit"
            element={
              <ProtectedRoute element={EditStudent} allowedRoles={["admin"]} />
            }
          />
          <Route
            path="/admin/syllabus-courses"
            element={
              <ProtectedRoute
                element={SyllabusCourseList}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/pending-registrations"
            element={
              <ProtectedRoute
                element={PendingRegistrations}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/courses/:courseId/syllabus"
            element={
              <ProtectedRoute
                element={ManageCourseSyllabus}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/admin/assign-courses-to-teacher"
            element={
              <ProtectedRoute
                element={AssignCoursesToTeacher}
                allowedRoles={["admin"]}
              />
            }
          />

          <Route
            path="/coordinator-login"
            element={
              <RedirectIfAuthenticated>
                <CoordinatorLogin />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/admin/students/:id" element={<StudentDetails />} />

          <Route
            path="/admin-login"
            element={
              <RedirectIfAuthenticated>
                <AdminLogin />
              </RedirectIfAuthenticated>
            }
          />

          <Route
            path="/admin/payment-requests"
            element={
              <ProtectedRoute
                element={AdminPaymentRequests}
                allowedRoles={["admin"]}
              />
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
                allowedRoles={["coordinator","admin"]}
              />
            }
          />
          <Route
            path="/coordinator/pending-registrations"
            element={
              <ProtectedRoute
                element={CoordinatorPendingRegistrations}
                allowedRoles={["coordinator","admin"]}
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
          <Route
            path="/coordinator/courses/:courseId/students"
            element={
              <ProtectedRoute
                element={CourseEnrolledStudents}
                allowedRoles={["coordinator"]}
              />
            }
          />
          <Route
            path="/admin/registration-requests"
            element={
              <ProtectedRoute
                element={ViewRegistrationRequests}
                allowedRoles={["admin"]}
              />
            }
          />

          <Route
            path="/coordinator/courses/:courseId/enroll"
            element={
              <ProtectedRoute
                element={EnrollStudentsToCourse}
                allowedRoles={["coordinator"]}
              />
            }
          />
          <Route
            path="/coordinator/enrolled-students"
            element={
              <ProtectedRoute
                element={EnrolledStudents}
                allowedRoles={["coordinator"]}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
