import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { getFreshToken } from '../../utils/authToken';

export default function EnrollStudentsToCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getFreshToken();
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
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const alreadyEnrolledIds = new Set(enrollments.map(e => e.studentId));

  const availableStudents = students.filter(
    s =>
      !alreadyEnrolledIds.has(s.id) &&
      (s.nameFull?.toLowerCase().includes(search.toLowerCase()) ||
        s.nic?.includes(search))
  );

  const toggleSelect = (id) => {
    const updated = new Set(selected);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelected(updated);
  };

  const handleSubmit = async () => {
    try {
      const token = await getFreshToken();
      const enrollCalls = Array.from(selected).map(studentId =>
        axios.post(
          `${baseURL}/api/enrollments`,
          { studentId, courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(enrollCalls);
      setSuccess(true);
      setTimeout(() => navigate(`/coordinator/courses/${courseId}/students`), 1500);
    } catch (err) {
      console.error(err);
      alert("Some enrollments failed.");
    }
  };

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Enroll Students to: {course?.name}
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by full name or NIC"
          className="border px-3 py-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {availableStudents.length === 0 ? (
        <p className="text-gray-500">No eligible students found.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="w-full table-auto text-sm">
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
                    <td className="p-2">{student.nameFull}</td>
                    <td className="p-2">{student.nic || '-'}</td>
                    <td className="p-2">
                      {student.dob
                        ? new Date(student.dob).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={selected.size === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              Enroll {selected.size} Student{selected.size !== 1 ? 's' : ''}
            </button>

            {success && (
              <div className="text-green-600 flex items-center gap-2">
                <FaCheckCircle /> Enrolled successfully!
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
