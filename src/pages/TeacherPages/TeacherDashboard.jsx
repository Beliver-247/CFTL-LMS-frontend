import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaFileAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaUser,
  FaEnvelope,
  FaGraduationCap,
  FaDollarSign,
} from "react-icons/fa";

export default function TeacherDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "teacher") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      return navigate("/teacher-login");
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/teachers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          return navigate("/teacher-complete-profile");
        }
        setError(err.response?.data?.error || "Failed to fetch teacher profile.");
      }
    };

    fetchProfile();
  }, [navigate, baseURL]);

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-950/70 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaChalkboardTeacher className="text-red-500 text-3xl" />
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Overview */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white text-gray-900 rounded-3xl shadow-xl overflow-hidden mb-8 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUser className="text-red-600" />
            My Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileItem icon={<FaUser />} label="Name" value={profile.name} />
            <ProfileItem icon={<FaEnvelope />} label="Email" value={profile.email} />
            <ProfileItem icon={<FaChalkboardTeacher />} label="Type" value={profile.type} />
            <ProfileItem
              icon={<FaDollarSign />}
              label="Salary"
              value={typeof profile.salary === "number" ? `LKR ${profile.salary.toLocaleString()}` : profile.salary}
            />
            {Array.isArray(profile.qualifications) && profile.qualifications.length > 0 && (
              <div className="md:col-span-2 flex items-start">
                <FaGraduationCap className="text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Qualifications</p>
                  <p className="font-medium text-gray-900">
                    {profile.qualifications.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Dashboard Actions */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              icon={<FaBook className="text-red-700 text-xl" />}
              title="My Modules"
              subtitle="View and manage your modules"
              onClick={() => navigate("/teacher-modules")}
            />
            <ActionCard
              icon={<FaFileAlt className="text-red-700 text-xl" />}
              title="View Syllabus"
              subtitle="Access course syllabi"
              onClick={() => navigate("/syllabus")}
            />
            <ActionCard
              icon={<FaCalendarAlt className="text-red-700 text-xl" />}
              title="Exam Timetables"
              subtitle="View exam schedules"
              onClick={() => navigate("/exam-timetables")}
            />
            <ActionCard
              icon={<FaCalendarAlt className="text-red-700 text-xl" />}
              title="Academic Timetables"
              subtitle="View class schedules"
              onClick={() => navigate("/academic-timetables")}
            />
            <ActionCard
              icon={<FaMoneyBillWave className="text-red-700 text-xl" />}
              title="Payment Status"
              subtitle="Check your payment history"
              onClick={() => navigate("/payment-status")}
            />
            <ActionCard
              icon={<FaClipboardList className="text-red-700 text-xl" />}
              title="Update Payment Info"
              subtitle="Manage your bank details"
              onClick={() => navigate("/update-payment-details")}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center">
      <div className="text-gray-400 mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, subtitle, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white text-gray-900 rounded-3xl shadow-xl hover:shadow-2xl active:scale-[0.99] transition-all text-left"
    >
      <div className="p-6 flex items-center">
        <div className="bg-red-50 p-3 rounded-full mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </div>
    </motion.button>
  );
}