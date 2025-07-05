import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaEnvelope } from 'react-icons/fa';

export default function CoordinatorDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("adminToken");
      try {
        const res = await axios.get(`${baseURL}/api/courses/coordinator/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        setError('Failed to fetch student data');
      }
    };

    fetchStudents();
  }, []);

  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <FaUserGraduate />
        <span>Students Enrolled in Your Courses</span>
      </h2>

      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map(student => (
            <div key={student.id} className="p-4 bg-white shadow rounded-lg">
              <h3 className="font-semibold text-lg">{student.nameFull}</h3>
              <p className="text-sm text-gray-600">
                <FaEnvelope className="inline mr-1" /> {student.email}
              </p>
              <p className="text-sm text-gray-500">
                Course: {student.enrolledCourse?.name} ({student.enrolledCourse?.duration})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
