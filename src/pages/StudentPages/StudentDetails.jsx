import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { getFreshToken } from "../../utils/authToken";

export default function StudentDetails() {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        alert("Failed to fetch student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = await getFreshToken();
      await axios.delete(`${baseURL}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/manage-students");
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading student details...</p>
      </div>
    );
  }

  if (!student) return <div className="text-center text-red-500">Student not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/manage-students")}
        className="mb-4 text-blue-600 hover:underline flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back to Student List
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-700">{student.nameFull}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Registration No:</strong> {student.registrationNo}</div>
          <div><strong>NIC:</strong> {student.nic}</div>
          <div><strong>Telephone:</strong> {student.telephone}</div>
          <div><strong>Religion:</strong> {student.religion}</div>
          <div><strong>Date of Birth:</strong> {new Date(student.dob.seconds * 1000).toLocaleDateString()}</div>
          <div><strong>Monthly Fee:</strong> Rs. {student.monthlyFee}</div>
          <div><strong>Total Amount:</strong> Rs. {student.totalAmount}</div>
        </div>

        <hr />

        <h3 className="text-xl font-semibold mt-4 text-gray-700">Parent Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Mother:</strong><br />
            Name: {student.parents?.mother?.name || "-"}<br />
            NIC: {student.parents?.mother?.nic || "-"}<br />
            Email: {student.parents?.mother?.email || "-"}
          </div>
          <div>
            <strong>Father:</strong><br />
            Name: {student.parents?.father?.name || "-"}<br />
            NIC: {student.parents?.father?.nic || "-"}<br />
            Email: {student.parents?.father?.email || "-"}
          </div>
        </div>

        <hr />

        <h3 className="text-xl font-semibold mt-4 text-gray-700">Nominee</h3>
        <div>
          Name: {student.nominee?.name || "-"}<br />
          NIC: {student.nominee?.nic || "-"}
        </div>

        {student.enrolledCourse?.details && (
          <>
            <hr />
            <h3 className="text-xl font-semibold mt-4 text-gray-700">Enrolled Course</h3>
            <div>
              Name: {student.enrolledCourse.details.name}<br />
              Duration: {student.enrolledCourse.details.duration}
            </div>
          </>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/admin/students/${student.id}/edit`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
