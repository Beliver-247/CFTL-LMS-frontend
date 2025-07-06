import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await axios.get(`${baseURL}/api/enrollments/coordinator`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load enrolled students');
      }
    };

    fetchEnrolledStudents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {students.length === 0 ? (
        <p>No students enrolled in your assigned courses.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course ID</th>
                <th className="px-4 py-2">Monthly Fee</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="px-4 py-2">{entry.student.fullName}</td>
                  <td className="px-4 py-2">{entry.student.email}</td>
                  <td className="px-4 py-2">{entry.courseId}</td>
                  <td className="px-4 py-2">Rs. {entry.monthlyFee}</td>
                  <td className="px-4 py-2 capitalize">{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
