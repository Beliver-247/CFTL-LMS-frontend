
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUserPlus, FaUsers, FaTrash } from "react-icons/fa";
import StudentPaymentsModal from "../../Modals/StudentPaymentModal";

export default function CourseEnrolledStudents() {
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPaymentsModal = (studentId) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };

  const closePaymentsModal = () => {
    setSelectedStudentId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          axios.get(`${baseURL}/api/courses/coordinator/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/enrollments/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const courseData = coursesRes.data.find((c) => c.id === courseId);
        setCourse(courseData);
        setEnrollments(enrollmentsRes.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, baseURL, token]);

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.student?.nameFull?.toLowerCase().includes(search.toLowerCase()) ||
      e.student?.nic?.includes(search)
  );

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      await axios.patch(
        `${baseURL}/api/enrollments/${enrollmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrollments(prev =>
        prev.map(e =>
          e.id === enrollmentId ? { ...e, status: newStatus } : e
        )
      );
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to update status.");
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this student from the course?"
      )
    )
      return;
    try {
      await axios.delete(`${baseURL}/api/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    } catch (err) {
      alert("Failed to remove student.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-green-600 rounded-full" />
      </div>
    );
  }

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

      <input
        type="text"
        placeholder="Search enrolled students..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredEnrollments.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">NIC</th>
                <th className="p-2">DOB</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{enrollment.student?.nameFull || 'N/A'}</td>
                  <td className="p-2">{enrollment.student?.nic}</td>
                  <td className="p-2">
                    {enrollment.student?.dob
                      ? new Date(enrollment.student.dob).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="p-2">
                    <select
                      className="border px-2 py-1 rounded"
                      value={enrollment.status}
                      onChange={(e) =>
                        handleStatusChange(enrollment.id, e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleUnenroll(enrollment.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => openPaymentsModal(enrollment.student.id)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      View Payments
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StudentPaymentsModal
        isOpen={isModalOpen}
        onClose={closePaymentsModal}
        studentId={selectedStudentId}
        courseId={courseId}
      />
    </div>
  );
}
