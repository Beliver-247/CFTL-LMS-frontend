// App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ParentLogin from './pages/ParentPages/ParentLogin';
import TeacherLogin from './pages/TeacherPages/TeacherLogin';
import TeacherDashboard from './pages/TeacherPages/TeacherDashboard';
import TeacherRegister from './pages/TeacherPages/TeacherRegister';
import TeacherCompleteProfile from './pages/TeacherPages/TeacherCompleteProfile';
import ParentRegister from './pages/ParentPages/ParentRegistration';
import ParentDashboard from './pages/ParentPages/ParentDashboard';
import StudentRegister from './pages/StudentPages/StudentRegister';
import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminCompleteProfile from './pages/AdminPages/AdminProfileForm';
import AdminDashboard from './pages/AdminPages/AdminDashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-register" element={<TeacherRegister />} />
          <Route path="/teacher-complete-profile" element={<TeacherCompleteProfile />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/parent-register" element={<ParentRegister />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-complete-profile" element={<AdminCompleteProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}