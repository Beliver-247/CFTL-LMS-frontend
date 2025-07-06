import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { FaBook, FaClock, FaUserGraduate, FaUserTie, FaSignOutAlt } from 'react-icons/fa';

export default function CoordinatorDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await axios.get(`${baseURL}/api/courses/coordinator/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("adminToken");
    window.location.href = "/coordinator-login";
  };

  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <FaUserTie className="text-3xl" />
            <span>Coordinator Dashboard</span>
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <FaBook />
          <span>Your Assigned Courses</span>
        </h2>

        {courses.length === 0 ? (
          <p>No courses assigned to you yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <div key={course.id} className="p-5 bg-white shadow rounded-lg">
                <h3 className="text-lg font-semibold mb-1">{course.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Program: {course.program} {course.stream ? `- ${course.stream}` : ''}
                </p>
                <p className="text-sm text-gray-600 mb-1">Year: {course.year}</p>
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <FaClock className="mr-1" /> Duration: {course.duration}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaUserGraduate className="mr-1" /> Total Fee: Rs. {course.totalFee}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
