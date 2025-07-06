import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

export default function EnrollStudentsToCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
        setError('Failed to load data');
      }
    };

    fetchData();
  }, [courseId]);

  const alreadyEnrolledIds = new Set(enrollments.map(e => e.studentId));
  const availableStudents = students.filter(
    s => !alreadyEnrolledIds.has(s.id) &&
      (s.name?.toLowerCase().includes(search.toLowerCase()) || s.nic?.includes(search))
  );

  const toggleSelect = (id) => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  const handleSubmit = async () => {
    try {
      const enrollCalls = Array.from(selected).map(studentId =>
        axios.post(`${baseURL}/api/enrollments`, { studentId, courseId }, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      await Promise.all(enrollCalls);
      setSuccess(true);
      setTimeout(() => navigate(`/coordinator/courses/${courseId}/students`), 1500);
    } catch (err) {
      alert("Some enrollments failed.");
    }
  };

  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Enroll Students to: {course?.name}
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or NIC"
          className="border px-3 py-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {availableStudents.length === 0 ? (
        <p>No eligible students found.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Select</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">NIC</th>
                  <th className="p-2">DOB</th>
                </tr>
              </thead>
              <tbody>
                {availableStudents.map(student => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selected.has(student.id)}
                        onChange={() => toggleSelect(student.id)}
                      />
                    </td>
                    <td className="p-2">{student.name}</td>
                    <td className="p-2">{student.nic}</td>
                    <td className="p-2">{new Date(student.dob).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={selected.size === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Enroll {selected.size} Student{selected.size !== 1 ? 's' : ''}
            </button>
          </div>

          {success && (
            <div className="mt-4 text-green-600 flex items-center gap-2">
              <FaCheckCircle /> Students enrolled successfully!
            </div>
          )}
        </form>
      )}
    </div>
  );
}
