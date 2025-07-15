import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getFreshToken } from "../../utils/authToken";
import { motion } from "framer-motion";
import { FaUsers, FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";
import UpdateStartingMonthModal from "../../Modals/UpdateStartingMonthModal";

export default function AdminDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [showMonthsModal, setShowMonthsModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = await getFreshToken();
      if (!token) {
        navigate("/admin-login");
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/api/admins/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/admin-complete-profile");
        } else {
          setError("Failed to fetch admin profile");
        }
      }
    };

    fetchAdmin();
  }, [navigate]);

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  if (!admin)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
      </div>
    );

  const cards = [
    {
      title: "Manage Students",
      icon: <FaUsers className="text-red-700 text-2xl" />,
      description: "Add, update or remove students",
      onClick: () => navigate("/admin/manage-students"),
    },
    {
      title: "Manage Teachers",
      icon: <FaChalkboardTeacher className="text-red-700 text-2xl" />,
      description: "Assign subjects or edit teacher info",
      onClick: () => alert("Manage Teachers"),
    },
    {
      title: "Manage Syllabus",
      icon: <FaBookOpen className="text-red-700 text-2xl" />,
      description: "Edit curriculum and course content",
      onClick: () => alert("Manage Syllabus"),
    },
    {
      title: "Manage Courses",
      icon: <FaBookOpen className="text-red-700 text-2xl" />,
      description: "Create, edit, or delete courses",
      onClick: () => navigate("/admin/manage-courses"),
    },
    {
      title: "Manage Subjects",
      icon: <FaBookOpen className="text-red-700 text-2xl" />,
      description: "Add, edit, or remove subjects",
      onClick: () => navigate("/admin/manage-subjects"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-90 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={() => setShowMonthsModal(true)}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Update Starting Months
            </button>
            <button
              onClick={() => navigate("/student-register")}
              className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
            >
              Register Student
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              onClick={card.onClick}
              className="bg-white text-gray-800 rounded-3xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">{card.icon}</div>
                <h2 className="text-xl font-bold text-red-700">{card.title}</h2>
              </div>
              <p className="text-sm text-gray-700">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {showMonthsModal && <UpdateStartingMonthModal onClose={() => setShowMonthsModal(false)} />}

    </div>
    
  );
}
