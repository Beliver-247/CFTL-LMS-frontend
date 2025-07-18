import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen, FaClock } from "react-icons/fa";

export default function SyllabusCourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${baseURL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch courses.");
      }
    };

    fetchCourses();
  }, [baseURL]);

  const handleCourseClick = (id) => {
    navigate(`/admin/courses/${id}/syllabus`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Select a Course to Manage Syllabus</h1>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white text-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{course.name}</h2>
              <p className="text-sm text-gray-700 mb-1">Program: {course.program}</p>
              <p className="text-sm text-gray-700 mb-1">Year: {course.year}</p>
              <p className="text-sm text-gray-700 flex items-center">
                <FaClock className="mr-1" /> Duration: {course.duration}
              </p>
              <p className="text-sm text-gray-700 flex items-center mt-1">
                <FaBookOpen className="mr-1" /> Total Fee: Rs. {course.totalFee}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
