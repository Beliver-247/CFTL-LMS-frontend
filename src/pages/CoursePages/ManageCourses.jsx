import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ManageCourses() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${baseURL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [baseURL, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`${baseURL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete course.');
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = filterGrade ? course.grade === parseInt(filterGrade) : true;
    const matchesDuration = filterDuration ? course.duration === filterDuration : true;
    return matchesSearch && matchesGrade && matchesDuration;
  });

  return (
    <div className="bg-gray-900 bg-opacity-90 min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-between items-center mb-6 gap-4"
        >
          <h2 className="text-3xl font-bold text-white">Manage Courses</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/subjects/create')}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <FaPlus className="mr-2" /> Create Subject
            </button>
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="flex items-center bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
            >
              <FaPlus className="mr-2" /> Create Course
            </button>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 text-gray-900"
          />
          <input
            type="number"
            placeholder="Filter by grade"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-40 text-gray-900"
          />
          <select
            value={filterDuration}
            onChange={(e) => setFilterDuration(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-40 text-gray-900"
          >
            <option value="">All Durations</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-white rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white text-gray-800 p-6 rounded-3xl shadow-xl relative"
              >
                <h3 className="text-lg font-bold text-red-700 mb-1">{course.name}</h3>
                <p className="text-sm text-gray-600">
                  {course.program} — Grade {course.grade}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {course.duration} | Year: {course.year}
                </p>
                {course.stream && (
                  <p className="text-sm text-gray-500">Stream: {course.stream}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Coordinator: {course.coordinatorEmail}</p>
                <p className="text-sm text-gray-700 mt-2 font-medium">Total Fee: Rs. {course.totalFee}</p>

                {course.subjectDetails?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Subjects:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {course.subjectDetails.map((subj) => (
                        <li key={subj.id}>{subj.subjectName}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex mt-4 space-x-3">
                  <button
                    onClick={() => navigate(`/admin/courses/edit/${course.id}`)}
                    className="flex items-center text-sm text-yellow-600 hover:text-yellow-800"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
