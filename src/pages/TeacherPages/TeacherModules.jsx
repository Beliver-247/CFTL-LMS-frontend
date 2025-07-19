// pages/TeacherPages/TeacherModules.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBook } from 'react-icons/fa';

export default function TeacherModules() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");

      if (!token || role !== "teacher") {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/teacher-login");
        return;
      }

      try {
        const profileRes = await axios.get(`${baseURL}/api/teachers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const assignedCourses = profileRes.data.assignedCourses || [];

        const allCoursesRes = await axios.get(`${baseURL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredCourses = allCoursesRes.data.filter((course) =>
          assignedCourses.includes(course.id)
        );

        setCourses(filteredCourses);
      } catch (err) {
        setError('Failed to fetch assigned courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCourses();
  }, [baseURL, navigate]);

  const handleCourseClick = (id) => {
    navigate(`/teacher/courses/${id}/update-status`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Assigned Courses</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium mb-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
              onClick={() => handleCourseClick(course.id)}
            >
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <FaBook /> {course.name}
              </h2>
              <p className="text-gray-600 text-sm">Program: {course.program}</p>
              <p className="text-gray-600 text-sm">Year: {course.year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
