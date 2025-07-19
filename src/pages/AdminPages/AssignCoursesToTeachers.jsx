// pages/AdminPages/AssignCoursesToTeacher.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AssignCoursesToTeacher() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, courseRes] = await Promise.all([
          axios.get(`${baseURL}/api/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseURL}/api/courses`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTeachers(teacherRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        setMessage('Failed to load data.');
      }
    };

    fetchData();
  }, [baseURL, token]);

  const handleCourseToggle = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedTeacher || selectedCourses.length === 0) {
      setMessage('Please select a teacher and at least one course.');
      return;
    }

    try {
      await axios.put(
        `${baseURL}/api/teachers/${selectedTeacher}/assign-courses`,
        { assignedCourses: selectedCourses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Courses assigned successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to assign courses.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Assign Courses to Teacher</h1>

      {message && (
        <div className="text-center text-red-600 font-medium mb-4">{message}</div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <label className="font-semibold">Select Teacher:</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="w-full mt-2 border px-4 py-2 rounded"
          >
            <option value="">-- Choose a teacher --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || t.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Assign Courses:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {courses.map((course) => (
              <label key={course.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={course.id}
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseToggle(course.id)}
                />
                <span>{course.name} ({course.program})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Assign Courses
          </button>
        </div>
      </div>
    </div>
  );
}
