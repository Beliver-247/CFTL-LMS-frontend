import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaUsers } from 'react-icons/fa';

export default function CourseEnrolledStudents() {
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourseAndEnrollments = async () => {
      try {
        const [coursesRes, enrollmentsRes, studentsRes] = await Promise.all([
          axios.get(`${baseURL}/api/courses/coordinator/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/enrollments/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const courseData = coursesRes.data.find(c => c.id === courseId);
        setCourse(courseData);
        setEnrollments(enrollmentsRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchCourseAndEnrollments();
  }, [courseId]);

  const alreadyEnrolledIds = enrollments.map(e => e.studentId);
  const availableStudents = students.filter(
    student => !alreadyEnrolledIds.includes(student.id) &&
      (student.name?.toLowerCase().includes(search.toLowerCase()) || student.nic?.includes(search))
  );

  const handleEnroll = async (studentId) => {
    try {
      await axios.post(`${baseURL}/api/enrollments`, {
        studentId,
        courseId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh enrollment list
      const updated = await axios.get(`${baseURL}/api/enrollments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEnrollments(updated.data);
      setShowModal(false);
    } catch (err) {
      alert("Enrollment failed.");
    }
  };

  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaUsers /> Students Enrolled in: {course?.name || '...'}
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => navigate(`/coordinator/courses/${courseId}/enroll`)}
        >
          <FaUserPlus />
          Enroll Student
        </button>
      </div>

      {enrollments.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">NIC</th>
                <th className="p-2">DOB</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(({ id, student }) => (
                <tr key={id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{student?.name || 'N/A'}</td>
                  <td className="p-2">{student?.nic}</td>
                  <td className="p-2">{new Date(student?.dob).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enroll Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">Enroll a Student</h2>

            <input
              type="text"
              placeholder="Search by name or NIC..."
              className="w-full border px-3 py-2 mb-4 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {availableStudents.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm bg-gray-100">
                      <th className="p-2">Name</th>
                      <th className="p-2">NIC</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableStudents.map(student => (
                      <tr key={student.id} className="border-b hover:bg-gray-50 text-sm">
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.nic}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEnroll(student.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                          >
                            Enroll
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
