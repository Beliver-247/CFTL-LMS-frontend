import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { motion } from "framer-motion";
import {
  FaBook,
  FaClock,
  FaUserGraduate,
  FaUserTie,
  FaSignOutAlt,
} from "react-icons/fa";

export default function CoordinatorDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken");
      try {
        const res = await axios.get(
          `${baseURL}/api/courses/coordinator/courses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(res.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [baseURL]);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("adminToken");
    window.location.href = "/coordinator-login";
  };

  const handleCourseClick = (courseId) => {
    navigate(`/coordinator/courses/${courseId}/students`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-white rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-2 flex justify-center items-center gap-2">
            <FaUserTie className="text-3xl" />
            <span>Coordinator Dashboard</span>
          </h1>

          <div className="flex justify-end mt-6 flex-wrap gap-4">
            <button
              onClick={() => navigate("/coordinator/enrolled-students")}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
            >
              View Enrolled Students
            </button>
            <button
              onClick={() => navigate("/coordinator/manage-payment-requests")}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Manage Payment Requests
            </button>
            <button
              onClick={() => navigate("/student-register")}
              className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
            >
              Register Student
            </button>
          </div>
        </motion.div>

        {/* COURSES SECTION */}
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FaBook className="text-red-500" />
          <span>Your Assigned Courses</span>
        </h2>

        {courses.length === 0 ? (
          <p className="text-gray-300">No courses assigned to you yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleCourseClick(course.id)}
                className="bg-white text-gray-800 rounded-3xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-indigo-700 mb-2">{course.name}</h3>
                <p className="text-sm text-gray-700 mb-1">
                  Program: {course.program} {course.stream && `- ${course.stream}`}
                </p>
                <p className="text-sm text-gray-700 mb-1">Year: {course.year}</p>
                <p className="text-sm text-gray-700 mb-1 flex items-center">
                  <FaClock className="mr-1" /> Duration: {course.duration}
                </p>
                <p className="text-sm text-gray-700 flex items-center">
                  <FaUserGraduate className="mr-1" /> Total Fee: Rs. {course.totalFee}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
