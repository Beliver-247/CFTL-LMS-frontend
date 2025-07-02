import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  FaDollarSign
} from "react-icons/fa";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/teacher-login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/teachers/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/teacher-complete-profile');
        } else {
          setError('Failed to fetch profile');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  if (!profile) return (
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
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/teacher-login");
              }}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              My Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaUser className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaChalkboardTeacher className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{profile.type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaDollarSign className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">LKR {profile.salary?.toLocaleString()}</p>
                </div>
              </div>
              {profile.qualifications?.length > 0 && (
                <div className="flex items-start md:col-span-2">
                  <FaGraduationCap className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Qualifications</p>
                    <p className="font-medium">{profile.qualifications.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Modules */}
          <div 
            onClick={() => navigate('/teacher-modules')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">My Modules</h3>
                <p className="text-gray-500 text-sm">View and manage your teaching modules</p>
              </div>
            </div>
          </div>

          {/* View Syllabus */}
          <div 
            onClick={() => navigate('/syllabus')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaFileAlt className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">View Syllabus</h3>
                <p className="text-gray-500 text-sm">Access course syllabi and materials</p>
              </div>
            </div>
          </div>

          {/* Examination Timetables */}
          <div 
            onClick={() => navigate('/exam-timetables')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Exam Timetables</h3>
                <p className="text-gray-500 text-sm">View examination schedules</p>
              </div>
            </div>
          </div>

          {/* Academic Timetables */}
          <div 
            onClick={() => navigate('/academic-timetables')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-yellow-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Academic Timetables</h3>
                <p className="text-gray-500 text-sm">View class schedules</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div 
            onClick={() => navigate('/payment-status')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaMoneyBillWave className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Payment Status</h3>
                <p className="text-gray-500 text-sm">Check your payment history</p>
              </div>
            </div>
          </div>

          {/* Update Payment Details */}
          <div 
            onClick={() => navigate('/update-payment-details')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FaClipboardList className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Update Payment Details</h3>
                <p className="text-gray-500 text-sm">Manage your bank information</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}