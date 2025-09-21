// pages/TeacherPages/TeacherModules.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBook } from 'react-icons/fa';

export default function TeacherModules() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedSubjects = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');

      if (!token || role !== 'teacher') {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/teacher-login');
        return;
      }

      try {
        // Get teacher profile (contains assignedSubjects[])
        const profileRes = await axios.get(`${baseURL}/api/teachers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const assignedSubjects = Array.isArray(profileRes.data?.assignedSubjects)
          ? profileRes.data.assignedSubjects
          : [];

        // Get minimal subject list (public endpoint)
        const allSubjectsRes = await axios.get(`${baseURL}/api/subjects/public`);
        const allSubjects = Array.isArray(allSubjectsRes.data) ? allSubjectsRes.data : [];

        const filtered = allSubjects.filter((s) => assignedSubjects.includes(s.id));
        setSubjects(
          filtered.sort(
            (a, b) =>
              (a.program || '').localeCompare(b.program || '') ||
              (a.stream || '').localeCompare(b.stream || '') ||
              (a.subjectName || '').localeCompare(b.subjectName || '')
          )
        );
      } catch (err) {
        setError('Failed to fetch assigned subjects.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedSubjects();
  }, [baseURL, navigate]);

  const handleSubjectClick = (id) => {
    // Mirror your previous pattern, just under "subjects"
    navigate(`/teacher/subjects/${id}/update-status`);
  };

  const emptyState = useMemo(
    () => !loading && !error && subjects.length === 0,
    [loading, error, subjects.length]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Assigned Subjects</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium mb-4">{error}</div>
      ) : emptyState ? (
        <div className="text-center text-gray-600">No subjects assigned yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
              onClick={() => handleSubjectClick(s.id)}
            >
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                <FaBook /> {s.subjectName}
              </h2>
              <p className="text-gray-600 text-sm">Program: {s.program}</p>
              {s.program === 'AL' && (
                <p className="text-gray-600 text-sm">Stream: {s.stream}</p>
              )}
              {s.program === 'OL' && (
                <p className="text-gray-600 text-sm">
                  {s.isMandatory ? 'Mandatory' : 'Optional'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
