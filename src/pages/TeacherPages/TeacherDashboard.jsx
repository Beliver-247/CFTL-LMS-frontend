import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaFileAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaSignOutAlt,
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
          // No profile exists – redirect to complete it
          return navigate("/teacher-complete-profile");
        }

        setError(err.response?.data?.error || "Failed to fetch teacher profile.");
      }
    };

    fetchProfile();
  }, [navigate]);


  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FaChalkboardTeacher className="text-3xl" />
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Overview */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            My Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileItem icon={<FaUser />} label="Name" value={profile.name} />
            <ProfileItem icon={<FaEnvelope />} label="Email" value={profile.email} />
            <ProfileItem icon={<FaChalkboardTeacher />} label="Type" value={profile.type} />
            <ProfileItem
              icon={<FaDollarSign />}
              label="Salary"
              value={`LKR ${profile.salary?.toLocaleString()}`}
            />
            {profile.qualifications?.length > 0 && (
              <div className="md:col-span-2 flex items-start">
                <FaGraduationCap className="text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Qualifications</p>
                  <p className="font-medium">
                    {profile.qualifications.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            icon={<FaBook className="text-blue-600 text-xl" />}
            title="My Modules"
            subtitle="View and manage your modules"
            onClick={() => navigate("/teacher-modules")}
            bg="bg-blue-100"
          />
          <ActionCard
            icon={<FaFileAlt className="text-green-600 text-xl" />}
            title="View Syllabus"
            subtitle="Access course syllabi"
            onClick={() => navigate("/syllabus")}
            bg="bg-green-100"
          />
          <ActionCard
            icon={<FaCalendarAlt className="text-purple-600 text-xl" />}
            title="Exam Timetables"
            subtitle="View exam schedules"
            onClick={() => navigate("/exam-timetables")}
            bg="bg-purple-100"
          />
          <ActionCard
            icon={<FaCalendarAlt className="text-yellow-600 text-xl" />}
            title="Academic Timetables"
            subtitle="View class schedules"
            onClick={() => navigate("/academic-timetables")}
            bg="bg-yellow-100"
          />
          <ActionCard
            icon={<FaMoneyBillWave className="text-red-600 text-xl" />}
            title="Payment Status"
            subtitle="Check your payment history"
            onClick={() => navigate("/payment-status")}
            bg="bg-red-100"
          />
          <ActionCard
            icon={<FaClipboardList className="text-indigo-600 text-xl" />}
            title="Update Payment Info"
            subtitle="Manage your bank details"
            onClick={() => navigate("/update-payment-details")}
            bg="bg-indigo-100"
          />
        </div>
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

function ActionCard({ icon, title, subtitle, onClick, bg }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-6 flex items-center">
        <div className={`${bg} p-3 rounded-full mr-4`}>{icon}</div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
